# 🚀 Vercel 部署步骤

## ✅ 当前状态

- ✅ 代码已成功推送到 GitHub
- ✅ 仓库地址：https://github.com/maomiao1/sailing-agent
- 📦 准备开始 Vercel 部署！

---

## 🎯 第一步：登录 Vercel

1. 打开浏览器，访问：**https://vercel.com**
2. 点击右上角 **"Sign Up"**（如果已有账号点 "Log In"）
3. 选择 **"Continue with GitHub"**
4. 使用你的 GitHub 账号（maomiao1）登录
5. 授权 Vercel 访问你的 GitHub 仓库

---

## 📦 第二步：导入项目

### 1. 点击 "Add New..."

登录后，在 Vercel 首页：
- 点击右上角 **"Add New..."** 按钮
- 选择 **"Project"**

### 2. 导入 GitHub 仓库

在 "Import Git Repository" 页面：
- 找到 **"maomiao1/sailing-agent"** 仓库
- 点击右侧的 **"Import"** 按钮

如果看不到仓库：
- 点击 **"Adjust GitHub App Permissions"**
- 授权 Vercel 访问 sailing-agent 仓库
- 返回后刷新页面

---

## ⚙️ 第三步：配置项目（重要！）

导入后会进入配置页面，按照以下步骤操作：

### 1. 基本配置（自动检测，无需修改）

- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`（保持默认）
- **Build Command**: `npm run build`（保持默认）
- **Output Directory**: `.next`（保持默认）

### 2. 添加环境变量（最关键！）

找到 **"Environment Variables"** 部分，点击展开。

需要添加 3 个环境变量，从你的 `.env.local` 文件中复制值：

#### 环境变量 1：
- **NAME**: `NEXT_PUBLIC_SUPABASE_URL`
- **VALUE**: `https://gngtrftfgvrmmjinlnsz.supabase.co`
- 勾选：✅ Production, ✅ Preview, ✅ Development

#### 环境变量 2：
- **NAME**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **VALUE**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZ3RyZnRmZ3ZybW1qaW5sbnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0OTYwNTEsImV4cCI6MjA4MTA3MjA1MX0.FB4N1Zp-wjMoxpk9Awin0iIkjw2Ykw6U69_P-N47fQY`
- 勾选：✅ Production, ✅ Preview, ✅ Development

#### 环境变量 3：
- **NAME**: `GEMINI_API_KEY`
- **VALUE**: `sk-6S9hMspZsz3wBIgeat2ttHwdMhMpv5tApIfqJ11Vheoocgze`
- 勾选：✅ Production, ✅ Preview, ✅ Development

⚠️ **重要提示**：
- 每个变量添加后点击 **"Add"** 按钮
- 确保所有 3 个环境都勾选了（Production, Preview, Development）
- 仔细检查没有多余的空格或换行

---

## 🚀 第四步：开始部署

1. 确认所有配置正确
2. 确认 3 个环境变量都已添加
3. 点击页面底部的蓝色 **"Deploy"** 按钮

---

## ⏳ 第五步：等待部署完成

部署过程需要 2-3 分钟，你会看到：

1. **Building**（构建中）
   - Installing dependencies（安装依赖）
   - Building application（构建应用）

2. **Deploying**（部署中）
   - Uploading files（上传文件）

3. **Ready**（完成）
   - 🎉 显示 "Congratulations" 页面

---

## 🎉 第六步：获取网站地址

部署成功后：

1. Vercel 会显示你的网站地址，格式类似：
   ```
   https://sailing-agent-xxx.vercel.app
   ```

2. 点击 **"Visit"** 按钮访问你的网站

3. 或者点击 **"Continue to Dashboard"** 进入项目管理页面

---

## ✅ 第七步：验证部署

访问你的网站后，检查：

1. ✅ 首页正常显示
2. ✅ 可以点击"添加新项目"
3. ✅ 可以创建项目
4. ✅ 可以上传航海手册
5. ✅ 可以生成内容

---

## 📝 完成后告诉我

部署成功后，请告诉我：

1. ✅ 部署成功
2. 🌐 你的网站地址（如：https://sailing-agent-xxx.vercel.app）

然后我们就完成了整个部署流程！🎊

---

## ⚠️ 常见问题

### Q1: 部署失败，显示构建错误
**解决方法**：
1. 检查环境变量是否正确配置
2. 查看 Vercel 的构建日志，找到具体错误信息
3. 告诉我错误信息，我帮你解决

### Q2: 部署成功但网站打不开
**解决方法**：
1. 等待 1-2 分钟，DNS 生效需要时间
2. 刷新页面
3. 清除浏览器缓存

### Q3: 网站打开了但功能不正常
**解决方法**：
1. 检查浏览器控制台（F12）是否有错误
2. 确认环境变量是否正确配置
3. 检查 Supabase 数据库是否正常运行

---

## 🆘 需要帮助？

如果遇到任何问题，把错误信息或截图发给我，我会立即帮你解决！

**祝部署顺利！** 🚀
