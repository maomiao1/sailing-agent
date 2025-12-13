# 航海实战组件内容生成Agent

基于 AI 的智能内容生成平台，通过上传航海手册，自动生成6大标准化组件内容。

## 功能特点

- 智能生成6大核心组件：
  - 开船第一课
  - 详情页
  - 航线图
  - 报名表单
  - 打卡日志
  - 开船话术

- 简洁易用的界面
- 实时内容编辑
- 一键复制功能
- 项目管理和历史记录
- 使用 Gemini 2.0 Flash（性价比极高）

## 技术栈

- **前端**: Next.js 16 + React 19 + Tailwind CSS v4
- **数据库**: Supabase (PostgreSQL)
- **AI服务**: Google Gemini 2.0 Flash
- **图标**: Lucide React
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local`:

```bash
cp .env.example .env.local
```

然后编辑 `.env.local` 文件，填入以下信息：

```env
# Supabase 配置 (https://supabase.com/)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini API 配置 (https://ai.google.dev/)
GEMINI_API_KEY=your_gemini_api_key
```

### 3. 创建 Supabase 数据库

1. 访问 [Supabase](https://supabase.com/) 注册账号
2. 创建新项目
3. 在 SQL Editor 中执行 `supabase-schema.sql` 文件的内容
4. 获取 Project URL 和 anon key 填入 `.env.local`

### 4. 获取 Gemini API Key

1. 访问 [Google AI Studio](https://ai.google.dev/)
2. 登录 Google 账号
3. 创建 API Key
4. 将 API Key 填入 `.env.local`

### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

## 使用说明

### 创建项目

1. 点击首页的"添加新项目"按钮
2. 输入项目名称和负责人
3. 点击"创建项目"

### 生成内容

1. 进入项目详情页
2. 上传航海手册文件（支持 .txt, .md, .doc, .docx）
3. 点击"一键生成全部内容"按钮
4. 等待 AI 生成完成（通常需要 1-2 分钟）

### 编辑和复制

- 点击组件的"编辑"按钮可以修改生成的内容
- 点击"复制"按钮可以将内容复制到剪贴板
- 所有修改会自动保存到数据库

## 项目结构

```
sailing-agent/
├── app/                      # Next.js App Router
│   ├── api/                  # API 路由
│   │   ├── generate-all/     # 生成所有组件
│   │   ├── generate-component/ # 生成单个组件
│   │   └── update-component/  # 更新组件内容
│   ├── project/[id]/         # 项目详情页
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 首页
├── components/               # React 组件
│   ├── ProjectCard.tsx       # 项目卡片
│   ├── CreateProjectDialog.tsx # 创建项目对话框
│   └── ComponentSection.tsx  # 组件内容区块
├── lib/                      # 工具库
│   ├── supabase.ts           # Supabase 客户端
│   ├── gemini.ts             # Gemini AI 客户端
│   └── constants.ts          # 常量定义
├── supabase-schema.sql       # 数据库结构
├── .env.local                # 环境变量（需自行创建）
└── README.md                 # 本文档
```

## 成本预估

### 免费额度（推荐初期使用）

- **Supabase**: 免费额度包含 500MB 数据库 + 1GB 文件存储
- **Gemini API**: 每分钟15次请求免费
- **Vercel**: 免费托管

### 付费后成本（月）

- **Supabase Pro**: $25/月（可选）
- **Gemini API**:
  - 输入: $0.075 / 1M tokens
  - 输出: $0.30 / 1M tokens
  - 单个项目生成成本约 ¥0.2-0.5
  - 每月50个项目约 ¥10-25
- **Vercel Pro**: $20/月（可选）

**总计**: 初期免费，付费后约 ¥200-400/月

## 部署到 Vercel

详细部署步骤请参考 **[DEPLOYMENT.md](./DEPLOYMENT.md)** 文档。

### 快速部署步骤

1. 将代码推送到 GitHub
2. 访问 [Vercel](https://vercel.com/)
3. 点击 "Import Project"
4. 选择你的 GitHub 仓库
5. 添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
6. 点击 Deploy

**重要提示**: 部署后仍可通过运行模板更新脚本修改内容，无需重新部署。详见 [DEPLOYMENT.md](./DEPLOYMENT.md)。

## 常见问题

### 1. API 调用失败

- 检查 Gemini API Key 是否正确
- 确认账号是否有足够的免费额度
- 查看浏览器控制台的错误信息

### 2. 数据库连接失败

- 检查 Supabase URL 和 Key 是否正确
- 确认数据库表已经正确创建
- 检查 Supabase 项目是否在运行中

### 3. 生成的内容质量不佳

- 确保上传的航海手册内容完整清晰
- 可以在 `lib/gemini.ts` 中调整 Prompt
- 可以在数据库的 `templates` 表中自定义生成标准

## 更新日志

### v1.0.0 (2025-12-11)

- 初始版本发布
- 支持6大组件自动生成
- 支持内容编辑和复制
- 使用 Gemini 2.0 Flash API
- 生财有术主题设计

## 技术支持

如有问题，请检查：
1. 环境变量是否配置正确
2. 数据库是否正常运行
3. API Key 是否有效

## 许可证

MIT License

---

**开发者**: Claude Code
**版本**: 1.0.0
**更新时间**: 2025-12-11
