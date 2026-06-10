"use client";
//？为什么这里添加了"use client"就可以在组件里添加动态的点击事件？

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { FaGithub, FaGoogle } from "react-icons/fa"

import { useSignUp } from "../hooks/use-sign-up";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { TriangleAlert } from "lucide-react";

export const SignUpCard = () => {
  const mutation = useSignUp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const errorMessage = mutation.error?.code === "EMAIL_ALREADY_EXISTS"
    ? "该邮箱已被注册，请直接登录或换一个邮箱"
    : mutation.error
      ? "注册失败，请稍后重试"
      : null;

  //表单处理函数
  const onCredentialSignUp = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    mutation.mutate({
      name,
      email,
      password
    }, {
      onSuccess: () => {
        signIn("credentials", {
          email,
          password,
          callbackUrl: "/",
        })
      }
    })
  };

  const onProviderSignUp = (provider: "github" | "google") => {
    signIn(provider, { callbackUrl: "/" })
  }


  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>
          注册用户
        </CardTitle>
        <CardDescription>
          使用您的邮箱或其他服务继续登录
        </CardDescription>
      </CardHeader>
      {!!mutation.error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2
        text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>出错了</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onCredentialSignUp} className="space-y-2.5">
          <Input
            disabled={mutation.isPending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名称"
            type="text"
            required
          />
          <Input
            disabled={mutation.isPending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="邮箱"
            type="email"
            required
          />
          <Input
            disabled={mutation.isPending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码"
            type="password"
            required
            minLength={6}
            maxLength={20}
          />
          {errorMessage && (
            <p className="text-xs text-red-500">
              {errorMessage}
            </p>
          )}
          <Button disabled={mutation.isPending} type="submit" className="w-full" size="lg">
            注册
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={mutation.isPending}
            onClick={() => onProviderSignUp("github")}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FaGithub className="mr-2 size-5 top-1.7 left-2.5 absolute" />
            使用Github登录
          </Button>
          <Button
            disabled={mutation.isPending}
            onClick={() => onProviderSignUp("google")}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FaGoogle className="mr-2 size-5 top-1.7 left-2.5 absolute" />
            使用Google登录
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          已有账户？<Link href="/sign-in"><span className="text-sky-700 hover:underline">登录</span></Link>
        </p>
      </CardContent>
    </Card>
  )
}
