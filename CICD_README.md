# CI/CD 自动化部署文档

## 🎯 概述

本项目已配置完整的 CI/CD 自动化流程，实现代码推送后自动检查、构建和部署到 Vercel。

---

## 📦 已配置的功能

### ✅ 1. 自动代码检查
- **TypeScript 类型检查**：确保类型安全
- **ESLint 代码检查**：确保代码质量
- **构建测试**：确保项目可以成功构建

### ✅ 2. 自动部署
- **目标平台**：Vercel
- **触发条件**：推送到 `main` 或 `master` 分支
- **部署时机**：代码检查通过后自动触发

### ✅ 3. 状态通知
- GitHub Actions 日志中查看详细信息
- 自动生成部署摘要报告

---

## 🚀 工作流程

### 完整流程图

```
本地修改代码
    ↓
双击 push.bat（推送到GitHub）
    ↓
GitHub 接收推送
    ↓
触发 GitHub Actions
    ↓
┌─────────────────────────────┐
│   任务1: 代码检查和构建      │
├─────────────────────────────┤
│ 1. 检出代码                  │
│ 2. 安装 Node.js 18          │
│ 3. 安装依赖 (npm ci)        │
│ 4. TypeScript 检查          │
│ 5. ESLint 检查              │
│ 6. 构建项目 (npm run build) │
│ 7. 上传构建产物             │
└─────────────────────────────┘
    ↓ (检查通过)
┌─────────────────────────────┐
│   任务2: 部署到 Vercel       │
├─────────────────────────────┤
│ 1. 通知 Vercel 新提交       │
│ 2. Vercel 自动构建          │
│ 3. Vercel 自动部署          │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│   任务3: 部署通知            │
├─────────────────────────────┤
│ 生成部署摘要报告            │
└─────────────────────────────┘
    ↓
✅ 部署完成！网站已更新
```

---

## 📝 使用说明

### 方式一：使用推送脚本（推荐）

```bash
# 1. 修改代码
# 2. 双击运行
push.bat

# 3. 等待推送完成
# 4. 查看 GitHub Actions 运行状态
# 5. 等待 1-3 分钟，网站自动更新
```

### 方式二：手动推送

```bash
git add .
git commit -m "你的提交消息"
git push origin main
```

---

## 🔍 查看部署状态

### 1. GitHub Actions 状态

访问：`https://github.com/LarryPatton/LearningShare/actions`

你会看到：
- ✅ 绿色勾：所有检查通过，部署成功
- ❌ 红色叉：检查失败，部署中止
- 🟡 黄色圈：正在运行中

### 2. Vercel 部署状态

访问：`https://vercel.com/dashboard`

你会看到：
- 🚀 **Building**：正在构建
- ✅ **Ready**：部署成功
- ❌ **Error**：部署失败

---

## 🎨 GitHub Actions 工作流详解

### 文件位置
```
.github/
└── workflows/
    └── deploy.yml  ← CI/CD 配置文件
```

### 触发条件

```yaml
on:
  push:
    branches:
      - main
      - master
  pull_request:
    branches:
      - main
      - master
```

**说明**：
- 推送到 `main` 或 `master` → 触发检查 + 部署
- 创建 Pull Request → 仅触发检查（不部署）

### 任务详解

#### 任务1：build-check
```yaml
jobs:
  build-check:
    name: 🔍 代码检查和构建测试
    runs-on: ubuntu-latest
```

**步骤**：
1. ✅ 检出代码
2. ✅ 设置 Node.js 18
3. ✅ 安装依赖（`npm ci`）
4. ✅ TypeScript 检查（`tsc --noEmit`）
5. ✅ ESLint 检查（`npm run lint`）
6. ✅ 构建项目（`npm run build`）
7. ✅ 上传构建产物

#### 任务2：deploy
```yaml
deploy:
  name: 🚀 Deploy to Vercel
  needs: build-check  # 依赖任务1成功
```

**触发条件**：
- ✅ 任务1（build-check）成功
- ✅ 是 push 事件（不是 PR）
- ✅ 分支是 main 或 master

**说明**：Vercel 已通过 GitHub App 连接，会自动检测推送并部署。

#### 任务3：notify
```yaml
notify:
  name: 📬 Deployment Notification
  needs: [build-check, deploy]
  if: always()  # 无论成功失败都运行
```

**作用**：生成部署摘要报告

---

## ⚙️ 环境要求

### Node.js 版本
```yaml
env:
  NODE_VERSION: '18'
```

**说明**：项目使用 Node.js 18，与本地开发环境保持一致。

### npm 脚本要求

确保 `package.json` 中有以下脚本：

```json
{
  "scripts": {
    "dev": "next dev -p 2077",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## 🛠️ 常见问题

### Q1: 推送后没有触发 Actions？

**可能原因**：
1. 推送的不是 `main` 或 `master` 分支
2. Actions 被禁用了

**解决方法**：
```bash
# 检查当前分支
git branch

# 如果不是 main，切换到 main
git checkout main
git merge 你的分支名
git push origin main
```

### Q2: TypeScript 检查失败？

**原因**：代码中有类型错误

**解决方法**：
```bash
# 本地运行检查
npx tsc --noEmit

# 修复所有报错后再推送
```

### Q3: 构建失败？

**常见原因**：
- 依赖缺失
- 环境变量未配置
- 代码有语法错误

**解决方法**：
```bash
# 本地测试构建
npm run build

# 如果本地成功，远程失败，检查：
# 1. package.json 是否完整
# 2. .env.local 中的环境变量是否需要在 Vercel 中配置
```

### Q4: Vercel 部署失败？

**解决方法**：
1. 访问 Vercel Dashboard
2. 点击失败的部署
3. 查看详细日志
4. 根据错误信息修复

### Q5: 如何跳过 CI/CD？

在 commit 消息中添加 `[skip ci]`：

```bash
git commit -m "更新文档 [skip ci]"
git push
```

---

## 📊 性能优化

### 缓存策略

GitHub Actions 已配置 npm 缓存：

```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'  # 缓存 node_modules
```

**效果**：
- 首次运行：~3-5 分钟
- 后续运行：~1-2 分钟（缓存命中）

---

## 🔐 安全说明

### 敏感信息处理

**❌ 不要在代码中硬编码**：
- API密钥
- 数据库密码
- 其他敏感信息

**✅ 正确做法**：

1. 本地开发使用 `.env.local`（已在 `.gitignore` 中）
2. Vercel 部署在 Dashboard → Settings → Environment Variables 中配置

---

## 📈 监控和日志

### 查看部署日志

#### GitHub Actions 日志
1. 访问：https://github.com/LarryPatton/LearningShare/actions
2. 点击最近的工作流运行
3. 查看每个步骤的详细输出

#### Vercel 部署日志
1. 访问：https://vercel.com/dashboard
2. 点击项目
3. 点击"Deployments"
4. 查看每次部署的详细日志

---

## 🎯 最佳实践

### 1. 频繁小提交
```bash
# ✅ 好的做法
git commit -m "修复：目录跳转问题"
git commit -m "新增：PDF查看器功能"

# ❌ 避免
git commit -m "各种修改"  # 信息不明确
```

### 2. 本地测试后再推送
```bash
# 推送前运行
npm run lint
npm run build

# 确保本地没问题再推送
```

### 3. 查看 Actions 结果
```
推送后等待 1-2 分钟
→ 查看 GitHub Actions 是否通过
→ 查看 Vercel 部署是否成功
→ 访问网站验证更新
```

---

## 🚀 下一步

### 可选的增强功能

如果需要，可以添加：

1. **自动化测试**
   ```yaml
   - name: Run Tests
     run: npm test
   ```

2. **性能监控**
   - Lighthouse CI
   - 页面加载速度检查

3. **通知集成**
   - Slack 通知
   - 邮件通知
   - 微信通知

4. **多环境部署**
   - 开发环境（dev 分支）
   - 预生产环境（staging 分支）
   - 生产环境（main 分支）

---

## 📞 获取帮助

- **GitHub Actions 文档**：https://docs.github.com/actions
- **Vercel 文档**：https://vercel.com/docs
- **Next.js 部署指南**：https://nextjs.org/docs/deployment

---

## 📝 总结

现在你的工作流是这样的：

```
1. 本地修改代码
2. 双击 push.bat
3. 等待 2-3 分钟
4. 网站自动更新 ✅
```

**完全自动化，无需手动操作！** 🎉
