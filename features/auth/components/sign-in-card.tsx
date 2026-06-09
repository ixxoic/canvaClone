"use client";
//？为什么这里添加了"use client"就可以在组件里添加动态的点击事件？

import Link from "next/link";
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { FaGithub, FaGoogle } from "react-icons/fa"
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export const SignInCard = () => {
  const onProviderSignIn = (provider: "github" | "google") => {
    signIn(provider, { callbackUrl: "/" })
  }


  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>
          登录
        </CardTitle>
        <CardDescription>
          使用您的邮箱或其他服务继续登录
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <div className="flex flex-col gap-y-2.5">
          <Button
            onClick={() => onProviderSignIn("github")}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FaGithub className="mr-2 size-5 top-1.7 left-2.5 absolute" />
            使用Github登录
          </Button>
          <Button
            onClick={() => onProviderSignIn("google")}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FaGoogle className="mr-2 size-5 top-1.7 left-2.5 absolute" />
            使用Google登录
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          还没有账户？<Link href="/sign-up"><span className="text-sky-700 hover:underline">注册</span></Link>
        </p>
      </CardContent>
    </Card>
  )
}