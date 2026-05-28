import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";

//这里面需要传入完整的url，为了让地址能动态变化，我们需要创建一个环境变量文件
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);