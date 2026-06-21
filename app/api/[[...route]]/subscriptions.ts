import Stripe from "stripe";
import { verifyAuth } from "@hono/auth-js";
import { Hono } from "hono";
import { eq } from "drizzle-orm";

import { checkIsActive } from "@/features/subscriptions/lib";

import { stripe } from "@/lib/stripe";
import { db } from "@/db/drizzle";
import { subscriptions } from "@/db/schema";

const getSubscriptionPeriodEnd = (subscription: Stripe.Subscription) => {
  const firstItem = subscription.items.data[0];

  return firstItem?.current_period_end
    ? new Date(firstItem.current_period_end * 1000)
    : null;
}

const getSubscriptionPriceId = (subscription: Stripe.Subscription) => {
  return subscription.items.data[0]?.price.id;
}

const upsertSubscription = async ({
  subscription,
  userId,
}: {
  subscription: Stripe.Subscription;
  userId: string;
}) => {
  const priceId = getSubscriptionPriceId(subscription);

  if (!priceId) {
    throw new Error("订阅缺少价格信息");
  }

  const values = {
    status: subscription.status,
    userId,
    subscriptionId: subscription.id,
    customerId: subscription.customer as string,
    priceId,
    currentPeriodEnd: getSubscriptionPeriodEnd(subscription),
    updatedAt: new Date(),
  };

  const [existingSubscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.subscriptionId, subscription.id));

  if (existingSubscription) {
    await db
      .update(subscriptions)
      .set(values)
      .where(eq(subscriptions.subscriptionId, subscription.id));

    return;
  }

  await db
    .insert(subscriptions)
    .values({
      ...values,
      createdAt: new Date(),
    });
}

const app = new Hono()
  .post("/billing", verifyAuth(), async (c) => {
    const auth = c.get("authUser");

    if (!auth.token?.id) {
      return c.json({ error: "未授权" }, 401);
    }

    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, auth.token.id));

    if (!subscription) {
      return c.json({ error: "未找到订阅" }, 400);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    });

    if (!session.url) {
      return c.json({ error: "创建会话失败" }, 400);
    }

    return c.json({ data: session.url });
  })
  .get("/current", verifyAuth(), async (c) => {
    const auth = c.get("authUser");

    if (!auth.token?.id) {
      return c.json({ error: "未授权" }, 401);
    }

    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, auth.token.id));

    const active = checkIsActive(subscription);

    return c.json({
      data: {
        ...subscription,
        active
      }
    })
  })
  .post("/checkout", verifyAuth(), async (c) => {
    const auth = c.get("authUser");

    if (!auth.token?.id) {
      return c.json({ error: "未授权" }, 401);
    }

    //创建一个结账会话
    let session: Stripe.Checkout.Session;

    try {
      session = await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}?success=1`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}?canceled=1`,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: auth.token.email || "",
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        metadata: {
          userId: auth.token.id,
        },
        subscription_data: {
          metadata: {
            userId: auth.token.id,
          },
        },
      });
    } catch (error) {
      console.error("[subscriptions.checkout]", error);

      return c.json({ error: "创建会话失败" }, 400);
    }

    const url = session.url;

    if (!url) {
      return c.json({ error: "创建会话失败" }, 400);
    }

    return c.json({ data: url });
  })
  .post(
    "/webhook",
    async (c) => {
      const body = await c.req.text();
      const signature = c.req.header("Stripe-Signature") as string;
      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET!
        );
      } catch {
        return c.json({ error: "无效签名" }, 400)
      }

      try {
        if (event.type === "checkout.session.completed") {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.metadata?.userId;
          const subscriptionId = session.subscription;

          if (!userId || typeof subscriptionId !== "string") {
            return c.json({ error: "无效会话" }, 400);
          }

          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          await upsertSubscription({ subscription, userId });
        }

        if (event.type === "invoice.payment_succeeded") {
          const invoice = event.data.object as Stripe.Invoice;
          const subscriptionId = invoice.parent?.subscription_details?.subscription;

          if (typeof subscriptionId !== "string") {
            return c.json(null, 200);
          }

          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = subscription.metadata.userId;

          if (userId) {
            await upsertSubscription({ subscription, userId });
          } else {
            await db
              .update(subscriptions)
              .set({
                status: subscription.status,
                currentPeriodEnd: getSubscriptionPeriodEnd(subscription),
                updatedAt: new Date(),
              })
              .where(eq(subscriptions.subscriptionId, subscription.id));
          }
        }
      } catch (error) {
        console.error("[subscriptions.webhook]", event.type, error);
        return c.json({ error: "webhook处理失败" }, 500);
      }

      return c.json(null, 200);
    }
  )

export default app;
