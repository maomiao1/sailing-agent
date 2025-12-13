# 航海实战系统 - 详细部署指南

## 目录

1. [前期准备](#前期准备)
2. [Supabase 数据库配置](#supabase-数据库配置)
3. [Gemini API 配置](#gemini-api-配置)
4. [本地开发测试](#本地开发测试)
5. [部署到 Vercel](#部署到-vercel)
6. [常见问题排查](#常见问题排查)

---

## 前期准备

### 所需账号

- [ ] GitHub 账号（用于代码托管）
- [ ] Supabase 账号（数据库）
- [ ] Google 账号（Gemini API）
- [ ] Vercel 账号（部署）

### 预计时间

- 首次配置：30-45分钟
- 后续部署：5-10分钟

---

## Supabase 数据库配置

### 步骤 1: 创建 Supabase 项目

1. 访问 [https://supabase.com/](https://supabase.com/)
2. 点击 "Start your project" 或 "New Project"
3. 填写项目信息：
   - **Organization**: 选择或创建组织
   - **Project Name**: sailing-agent（或自定义名称）
   - **Database Password**: 设置强密码（请记住）
   - **Region**: 选择 `Northeast Asia (Tokyo)` 或 `Southeast Asia (Singapore)`
   - **Pricing Plan**: 选择 Free（免费版足够使用）
4. 点击 "Create new project"
5. 等待 1-2 分钟，项目创建完成

### 步骤 2: 执行数据库 SQL

1. 在 Supabase 项目页面，点击左侧菜单的 "SQL Editor"
2. 点击 "New query"
3. 打开项目中的 `supabase-schema.sql` 文件
4. 复制全部内容
5. 粘贴到 SQL Editor 中
6. 点击 "Run" 按钮执行
7. 看到绿色的 "Success" 提示表示成功

### 步骤 3: 获取连接信息

1. 点击左侧菜单的 "Project Settings"（齿轮图标）
2. 点击 "API" 标签
3. 找到以下信息并复制保存：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc......` （很长的一串）

### 步骤 4: 验证数据库表

1. 点击左侧菜单的 "Table Editor"
2. 应该能看到 3 个表：
   - `projects`
   - `components`
   - `templates`
3. 点击 `templates` 表，应该看到 6 条预置数据（6大组件模板）

---

## Gemini API 配置

### 步骤 1: 获取 API Key

1. 访问 [https://ai.google.dev/](https://ai.google.dev/)
2. 点击右上角 "Get API key in Google AI Studio"
3. 使用 Google 账号登录
4. 点击 "Get API key"
5. 选择 "Create API key in new project" 或使用现有项目
6. 复制生成的 API Key（格式：`AIzaSy......`）

### 步骤 2: 测试 API Key

可以使用以下命令测试（可选）：

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"你好"}]}]}'
```

如果返回 JSON 结果，说明 API Key 有效。

### 步骤 3: 了解使用限制

**免费额度**:
- 每分钟 15 次请求
- 每天 1500 次请求
- 每个月 100 万 tokens

**足够用于**: 每天生成 100+ 个项目的内容

---

## 本地开发测试

### 步骤 1: 配置环境变量

创建 `.env.local` 文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入之前获取的信息：

```env
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi......你的完整Key
GEMINI_API_KEY=AIzaSy......你的Gemini Key
```

### 步骤 2: 安装依赖并启动

```bash
npm install
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 步骤 3: 测试完整流程

1. **创建项目**
   - 点击 "添加新项目"
   - 输入项目名: "测试项目"
   - 负责人: "张三"
   - 点击创建

2. **上传航海手册**
   - 点击项目卡片的 "查看详情"
   - 准备一个 .txt 文件（可以随便写一些航海项目的描述）
   - 上传文件
   - 看到"已上传航海手册"提示

3. **生成内容**
   - 点击 "一键生成全部内容"
   - 等待 1-2 分钟（会调用 6 次 Gemini API）
   - 查看生成的 6 个组件内容

4. **编辑和复制**
   - 点击任意组件的 "编辑" 按钮
   - 修改内容后点击 "保存"
   - 点击 "复制" 按钮测试复制功能

如果以上流程都正常，说明系统配置成功！

---

## 部署到 Vercel

### 方式一: 通过 GitHub 自动部署（推荐）

#### 步骤 1: 推送代码到 GitHub

```bash
# 初始化 git
git init
git add .
git commit -m "Initial commit: 航海实战系统"

# 创建 GitHub 仓库（在 GitHub 网站上操作）
# 然后关联并推送
git remote add origin https://github.com/你的用户名/sailing-agent.git
git branch -M main
git push -u origin main
```

#### 步骤 2: 连接 Vercel

1. 访问 [https://vercel.com/](https://vercel.com/)
2. 使用 GitHub 账号登录
3. 点击 "Add New" → "Project"
4. 选择你的 `sailing-agent` 仓库
5. 点击 "Import"

#### 步骤 3: 配置环境变量

在 "Configure Project" 页面：

1. 展开 "Environment Variables"
2. 添加 3 个环境变量：

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase Key |
| `GEMINI_API_KEY` | 你的 Gemini API Key |

3. 确保选中 "Production", "Preview", "Development" 三个环境
4. 点击 "Deploy"

#### 步骤 4: 等待部署完成

- 首次部署需要 2-3 分钟
- 部署成功后会显示 "Congratulations!"
- 获得生产环境 URL: `https://sailing-agent.vercel.app`（或自定义域名）

### 方式二: 命令行部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel --prod

# 添加环境变量（在 vercel.com 后台操作）
```

---

## 常见问题排查

### 问题 1: 页面显示"加载项目失败"

**原因**: Supabase 连接失败

**解决方法**:
1. 检查 `.env.local` 中的 Supabase URL 和 Key 是否正确
2. 确认 Supabase 项目是否正常运行
3. 打开浏览器控制台（F12），查看具体错误信息
4. 确认数据库表是否正确创建

### 问题 2: "AI内容生成失败"

**原因**: Gemini API 调用失败

**解决方法**:
1. 检查 Gemini API Key 是否正确
2. 确认是否超出免费额度限制（每分钟15次）
3. 检查网络连接是否正常
4. 查看 Vercel 部署日志中的错误信息

### 问题 3: 上传文件后没有反应

**原因**: 文件读取失败

**解决方法**:
1. 确保文件格式正确（.txt, .md, .doc, .docx）
2. 检查文件内容是否为纯文本
3. 文件大小不要超过 1MB
4. 打开控制台查看错误信息

### 问题 4: Vercel 部署失败

**原因**: 环境变量未配置或代码错误

**解决方法**:
1. 在 Vercel 项目设置中确认环境变量已正确添加
2. 查看部署日志中的错误信息
3. 确认本地开发环境运行正常
4. 尝试重新部署：`vercel --prod --force`

### 问题 5: 数据库查询超时

**原因**: Supabase 免费版有连接限制

**解决方法**:
1. 检查 Supabase 项目状态
2. 确认没有达到免费额度上限
3. 考虑升级到 Pro 版本（$25/月）

---

## 性能优化建议

### 1. 数据库优化

- 定期清理过期项目（可在 Supabase 中设置自动清理规则）
- 为常用查询添加索引（已在 schema 中配置）

### 2. API 调用优化

- 使用"生成单个组件"而非"一键生成全部"来节省 API 调用
- 合理控制生成频率，避免超出限制

### 3. 前端性能

- 项目列表使用分页（超过 20 个项目时）
- 图片和文件使用 CDN 加速

---

## 成本控制

### 免费使用建议

- **每天生成项目数**: 控制在 50 个以内
- **数据库存储**: 定期清理历史数据
- **API 调用**: 避免频繁重新生成

### 升级时机

当出现以下情况时，考虑升级：

1. **Supabase 免费额度不足** → 升级到 Pro ($25/月)
2. **Gemini API 限制频繁** → 申请增加配额或付费
3. **访问量增大** → Vercel Pro ($20/月)

---

## 后续维护

### 定期检查

- [ ] 每周检查 Supabase 使用量
- [ ] 每月检查 Gemini API 使用统计
- [ ] 定期备份数据库数据

### 功能迭代

可以考虑添加的功能：
- 导出 Word/PDF 功能
- 批量生成功能
- 权限管理和多用户
- 历史版本对比
- 数据统计报表

---

## 联系支持

如遇到无法解决的问题：

1. 检查 GitHub Issues
2. 查看项目 README 中的常见问题
3. 查看 Supabase 和 Vercel 的官方文档

---

**祝您部署顺利！**

有任何问题欢迎随时咨询。
