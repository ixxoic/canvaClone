"use client";
//？为什么这里添加了"use client"就可以在组件里添加动态的点击事件？

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react"
import { FaGithub, FaGoogle } from "react-icons/fa"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { TriangleAlert } from "lucide-react";

export const SignInCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //获取url中的错误信息
  const params = useSearchParams();
  const error = params.get("error");

  //表单处理函数
  const onCredentialSignIn = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    signIn("credentials", {
      email: email,
      password: password,
      callbackUrl: "/"
    });
  };

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
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2
        text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>邮箱或密码无效</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onCredentialSignIn} className="space-y-2.5">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="邮箱"
            type="email"
            required
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码"
            type="password"
            required
          />
          <Button type="submit" className="w-full" size="lg">
            继续
          </Button>
        </form>
        <Separator />
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