# 部署指南 - Sailing Agent

## 📋 部署前准备

### 1. 确保代码已推送到 GitHub

```bash
# 如果还没有 git 仓库，先初始化
git init
git add .
git commit -m "准备部署"

# 创建 GitHub 仓库后，推送代码
git remote add origin https://github.com/你的用户名/sailing-agent.git
git branch -M main
git push -u origin main
```

### 2. 准备环境变量

你需要准备以下 3 个环境变量：

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase 项目 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase 匿名密钥
- `GEMINI_API_KEY` - EvoLink.AI 的 Gemini API 密钥

可以在 `.env.local` 文件中找到这些值。

---

## 🚀 Vercel 部署步骤

### 步骤 1：登录 Vercel

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 授权 Vercel 访问你的 GitHub 仓库

### 步骤 2：导入项目

1. 点击 "Add New..." → "Project"
2. 在列表中找到 `sailing-agent` 仓库
3. 点击 "Import"

### 步骤 3：配置项目

**Framework Preset**: 自动检测为 Next.js（无需修改）

**Root Directory**: `.` （无需修改）

**Build Command**: `npm run build`（自动设置）

**Output Directory**: `.next`（自动设置）

### 步骤 4：添加环境变量

在 "Environment Variables" 部分，添加以下 3 个变量：

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | 从 .env.local 复制 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 从 .env.local 复制 |
| `GEMINI_API_KEY` | 从 .env.local 复制 |

**重要**：确保所有环境变量都选择了以下环境：
- ✅ Production
- ✅ Preview
- ✅ Development

### 步骤 5：部署

1. 点击 "Deploy" 按钮
2. 等待 2-3 分钟，Vercel 会自动：
   - 安装依赖 (`npm install`)
   - 构建项目 (`npm run build`)
   - 部署到全球 CDN
3. 部署成功后，会显示：
   - 🎉 **Production URL**: `https://sailing-agent-xxx.vercel.app`
   - 这就是你的线上网址！

---

## ✅ 验证部署

### 1. 访问网站

打开 Vercel 提供的 URL，检查：
- ✅ 首页正常显示
- ✅ 可以创建新项目
- ✅ 可以上传航海手册
- ✅ 可以生成 6 大组件内容

### 2. 测试核心功能

1. 创建一个测试项目
2. 上传一个航海手册（.txt 或 .docx）
3. 点击"一键生成全部内容"
4. 检查生成的内容是否正确

---

## 🔧 部署后修改模板

**好消息**：部署后仍然可以修改模板！

### 修改流程

1. 在本地修改模板脚本（如 `update-first-lesson-template-v2.js`）
2. 运行脚本更新数据库：
   ```bash
   node update-first-lesson-template-v2.js
   ```
3. 修改会立即生效，**无需重新部署**

### 为什么不需要重新部署？

- 模板存储在 **Supabase 数据库** 中
- 网站从数据库读取模板
- 修改数据库后，网站会自动使用新模板
- 代码没有变化，所以不需要重新部署

### 可用的模板更新脚本

```bash
# 更新开船第一课模板
node update-first-lesson-template-v2.js

# 更新航线图模板
node update-route-map-template.js

# 其他模板更新脚本...
```

---

## 🔄 自动部署（CI/CD）

Vercel 已经自动配置了 CI/CD：

- 每次推送到 `main` 分支 → 自动部署到 Production
- 每次推送到其他分支 → 自动部署到 Preview 环境
- 每个 Pull Request → 自动生成预览链接

---

## 🌐 自定义域名（可选）

如果你有自己的域名，可以在 Vercel 中绑定：

1. 进入项目设置 → "Domains"
2. 添加你的域名（如 `sailing.yourdomain.com`）
3. 按照提示在域名提供商处添加 DNS 记录
4. 等待 DNS 生效（通常 5-30 分钟）

---

## 📊 监控和日志

### 查看部署日志

1. 进入 Vercel 项目页面
2. 点击 "Deployments"
3. 选择一个部署，查看详细日志

### 查看运行日志

1. 进入 Vercel 项目页面
2. 点击 "Functions" → 选择一个 API 路由
3. 查看实时日志和错误信息

### Supabase 数据库监控

1. 登录 Supabase Dashboard
2. 查看项目使用情况、请求数、存储等

---

## ⚠️ 常见问题

### 1. 部署失败：构建错误

**问题**：Build 阶段报错
**解决**：
```bash
# 在本地测试构建
npm run build

# 如果本地构建成功，检查 Vercel 环境变量是否正确
```

### 2. 网站访问 404

**问题**：部署成功但访问显示 404
**解决**：
- 检查 Vercel 项目设置中的 "Root Directory" 是否为 `.`
- 检查 "Output Directory" 是否为 `.next`

### 3. API 调用失败

**问题**：生成内容时报错
**解决**：
1. 检查 Vercel 环境变量是否正确配置
2. 检查 `GEMINI_API_KEY` 是否有效
3. 检查 Supabase 密钥是否正确

### 4. Supabase 连接失败

**问题**：无法连接数据库
**解决**：
1. 确认 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 正确
2. 检查 Supabase 项目是否处于活跃状态
3. 检查 Supabase RLS（Row Level Security）策略

---

## 📱 移动端适配

网站已经完全响应式设计，支持：
- ✅ 桌面浏览器
- ✅ 平板电脑
- ✅ 手机浏览器

---

## 🎯 下一步

部署成功后，你可以：

1. ✅ 分享链接给团队成员使用
2. ✅ 根据反馈修改模板（运行更新脚本）
3. ✅ 监控使用情况和性能
4. ✅ 可选：绑定自定义域名
5. ✅ 可选：创建管理后台（未来功能）

---

## 💡 技术支持

如果遇到问题：
1. 查看 Vercel 部署日志
2. 查看浏览器控制台错误
3. 查看 Supabase Dashboard 日志
4. 联系开发者

---

**祝部署顺利！🎉**
