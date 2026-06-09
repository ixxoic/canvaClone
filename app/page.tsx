import { protectServer } from "@/features/auth/utils";

export default async function Home() {
  await protectServer();

  return (
    <div>
      您已登录
    </div>
  );
}
