# My Canva

## 项目简介

My Canva 是一个基于 Next.js 构建的在线可视化设计编辑器，核心目标是提供类似 Canva 的轻量级图片设计体验。用户可以创建项目、选择模板、上传图片、编辑文本和图形元素，并将设计结果导出为 PNG、JPG、SVG 或 JSON 文件。

项目围绕「画布编辑 + 项目管理 + AI 图片能力 + 订阅权限」展开，适合作为前端实习投递项目，能够体现复杂交互组件封装、Canvas 编辑器设计、前后端类型联动、鉴权与权限控制、异步状态管理等工程能力。

## 在线预览

- 在线地址：待补充
- 预览截图：待补充

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 框架 | Next.js 16、React 19、TypeScript |
| 构建工具 | Next.js、Webpack |
| 路由管理 | Next.js App Router |
| 状态管理 | Zustand、React Query |
| UI 组件库 | Radix UI、shadcn/ui、lucide-react |
| Canvas 编辑 | Fabric.js |
| 请求与接口 | Hono、Hono Client、Zod |
| 数据库 | PostgreSQL、Drizzle ORM、Drizzle Kit |
| 鉴权 | NextAuth v5、Credentials、Google、GitHub |
| 文件上传 | UploadThing |
| AI 能力 | OpenAI 兼容图像生成 / 图像编辑接口 |
| 支付订阅 | Stripe Checkout、Billing Portal、Webhook |
| 样式方案 | Tailwind CSS |
| 代码规范 | ESLint、TypeScript |

## 核心功能

- 用户认证
  - 支持邮箱密码注册与登录
  - 支持 Google / GitHub 第三方登录
  - 基于 NextAuth 和 JWT Session 维护登录态
  - 服务端页面访问保护，未登录用户自动跳转登录页

- 项目管理
  - 创建空白设计项目
  - 查看最近项目列表
  - 分页加载更多项目
  - 复制项目
  - 删除项目
  - 根据项目 ID 进入编辑器继续编辑

- 模板能力
  - 首页展示设计模板
  - 支持从模板创建新项目
  - 区分普通模板与 Pro 模板
  - Pro 模板会触发订阅权限拦截

- 可视化编辑器
  - 基于 Fabric.js 实现画布编辑
  - 支持添加基础图形：圆形、矩形、圆角矩形、三角形、倒三角形、菱形
  - 支持添加和编辑文本
  - 支持图片上传与素材图片插入
  - 支持填充色、描边色、描边宽度、透明度调整
  - 支持字体、字号、字重、斜体、下划线、删除线、对齐方式调整
  - 支持图片滤镜效果
  - 支持自由绘制模式
  - 支持画布尺寸与背景色设置
  - 支持元素层级调整
  - 支持复制、粘贴、删除、全选、撤销、重做等快捷操作

- AI 图片能力
  - 根据文本 Prompt 生成图片并插入画布
  - 对选中图片执行 AI 背景移除
  - AI 功能接入订阅权限控制

- 图片与素材
  - 支持 UploadThing 上传本地图片
  - 支持从 Unsplash 随机图片集合中选择素材
  - 图片可直接添加到当前画布

- 导入导出
  - 支持导入 JSON 文件继续编辑
  - 支持导出 JSON 设计数据
  - 支持导出 PNG、JPG、SVG 图片文件

- 订阅与付费
  - 使用 Stripe 创建订阅 Checkout
  - 支持跳转 Stripe Billing Portal 管理订阅
  - 通过 Webhook 同步订阅状态
  - 根据订阅状态控制 Pro 模板、AI 生成和 AI 抠图能力

## 项目亮点

- 复杂 Canvas 编辑器封装  
  项目将 Fabric.js 的画布操作封装为统一的 `Editor` 对象，对外暴露添加元素、修改样式、导出文件、缩放、复制粘贴、撤销重做等方法，避免业务组件直接操作底层 Canvas 实例，降低编辑器功能扩展成本。

- 编辑状态与自动保存机制  
  编辑器监听 `object:added`、`object:removed`、`object:modified` 等 Canvas 事件，将画布序列化为 JSON，并通过防抖更新项目数据，解决频繁编辑导致的重复请求问题，同时在导航栏展示保存中、保存成功、保存失败等状态反馈。

- 撤销重做与历史记录设计  
  使用 `useHistory` 维护画布 JSON 快照数组，通过 `historyIndex` 控制撤销和重做边界，并使用 `skipSave` 避免撤销 / 重做过程再次写入历史记录，保证编辑历史行为符合用户预期。

- 响应式画布适配  
  使用 `ResizeObserver` 监听编辑区域尺寸变化，结合 Fabric.js 的缩放能力自动计算画布工作区适配比例，并同步更新 `clipPath`，解决不同屏幕尺寸下画布展示不完整或偏移的问题。

- 类型安全的前后端接口调用  
  API 层使用 Hono 定义路由，结合 `hono/client`、`InferRequestType` 和 `InferResponseType` 在前端 Hook 中推导请求参数与响应类型，减少接口字段变更带来的类型不一致问题。

- 权限与订阅能力闭环  
  项目通过 NextAuth 保护页面和 API，通过 Stripe 维护订阅状态，并在前端使用 `usePaywall` 对 Pro 模板、AI 图片生成、AI 背景移除等能力进行统一拦截，形成从登录态、接口鉴权到业务权限判断的完整链路。

## 目录结构

```bash
my-canva
├── app
│   ├── (auth)                  # 登录、注册页面
│   ├── (dashboard)             # 首页仪表盘、模板列表、项目列表
│   ├── api
│   │   ├── [[...route]]         # Hono 聚合 API 路由
│   │   ├── auth                # NextAuth API 路由
│   │   └── uploadthing         # 文件上传路由
│   ├── editor
│   │   └── [projectId]         # 编辑器页面
│   ├── globals.css             # 全局样式
│   └── layout.tsx              # 根布局与全局 Provider
├── components
│   ├── ui                      # shadcn/ui 基础组件
│   ├── modals.tsx              # 全局弹窗挂载
│   ├── providers.tsx           # 全局 Provider
│   └── query-provider.tsx      # React Query Provider
├── config
│   └── llmConfig.ts            # AI 图像接口配置
├── db
│   ├── drizzle.ts              # Drizzle 数据库连接
│   └── schema.ts               # 数据库表结构定义
├── drizzle                     # 数据库迁移文件
├── features
│   ├── ai                      # AI 图片生成请求 Hook
│   ├── auth                    # 登录注册组件与鉴权相关逻辑
│   ├── editor                  # 编辑器核心组件、Hooks、工具函数
│   ├── images                  # 图片素材与背景移除请求 Hook
│   ├── projects                # 项目 CRUD 请求 Hook
│   └── subscriptions           # 订阅弹窗、支付请求、权限控制
├── hooks
│   └── use-confirm.tsx         # 通用确认弹窗 Hook
├── lib
│   ├── hono.ts                 # Hono 类型安全客户端
│   ├── stripe.ts               # Stripe 实例
│   ├── uploadthing.ts          # UploadThing 客户端封装
│   └── utils.ts                # 通用工具函数
├── public                      # 静态资源与模板图片
├── auth.config.ts              # NextAuth 配置
├── auth.ts                     # NextAuth 导出
├── drizzle.config.ts           # Drizzle 配置
├── next.config.ts              # Next.js 配置
└── package.json                # 项目依赖与脚本
```

## 本地运行

> 环境变量模板待补充。项目依赖数据库、NextAuth、OAuth、UploadThing、Stripe、Unsplash 和 AI 图像接口等服务，运行前需要配置对应环境变量。

```bash
# 安装依赖
npm install

# 启动开发环境
npm run dev

# 构建生产包
npm run build

# 启动生产服务
npm run start
```

常用数据库命令：

```bash
# 生成迁移文件
npm run db:generate

# 执行数据库迁移
npm run db:migrate

# 打开 Drizzle Studio
npm run db:studio
```

## 环境变量

以下变量根据代码使用情况整理，具体值需要根据实际服务配置补充：

```bash
# App
NEXT_PUBLIC_APP_URL=待补充

# Auth
AUTH_SECRET=待补充
AUTH_GITHUB_ID=待补充
AUTH_GITHUB_SECRET=待补充
AUTH_GOOGLE_ID=待补充
AUTH_GOOGLE_SECRET=待补充

# Database
DATABASE_URL=待补充

# UploadThing
UPLOADTHING_TOKEN=待补充
UPLOADTHING_SECRET=待补充

# Unsplash
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=待补充

# AI Image
AI_IMAGE_BASE_URL=待补充
AI_IMAGE_API_KEY=待补充

# Stripe
STRIPE_SECRET_KEY=待补充
STRIPE_PRICE_ID=待补充
STRIPE_WEBHOOK_SECRET=待补充
```

## 数据模型概览

项目主要包含以下数据表：

- `user`：用户基础信息，包含邮箱、用户名、头像和密码字段
- `account`：NextAuth 第三方登录账号绑定信息
- `session`：NextAuth 会话信息
- `verificationToken`：验证 Token 信息
- `authenticator`：认证器相关信息
- `project`：设计项目数据，包含项目名称、画布 JSON、宽高、缩略图、模板标识、Pro 标识等
- `subscription`：用户订阅信息，包含 Stripe 订阅 ID、客户 ID、价格 ID、订阅状态和周期结束时间

