# 🚀 本地开发指南

这是一个基于 Next.js 14 的静态博客网站，支持富媒体内容展示（视频、音频、PDF、思维导图、问答卡片）。

## 📦 项目结构

```
blog/
├── content/posts/              # 文章内容目录
│   └── lsp-liskov-substitution-principle/
│       ├── index.md           # 文章正文
│       ├── cover.png          # 封面图
│       ├── mindmap.png        # 思维导图
│       ├── slides.pdf         # PPT 幻灯片
│       ├── flashcards.csv     # 问答卡片
│       ├── video.mp4          # 视频讲解
│       └── audio.m4a          # 音频讲解
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx        # 全局布局
│   │   ├── page.tsx          # 首页
│   │   └── articles/[slug]/  # 文章详情页
│   ├── components/           # React 组件
│   └── lib/                  # 工具函数
│
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🛠️ 环境要求

- **Node.js**: 18.17 或更高版本
- **包管理器**: npm、yarn 或 pnpm

## 📥 第一步：安装依赖

在项目根目录（`d:\BLOG`）打开终端，运行：

```bash
npm install
```

这将安装所有必需的依赖包（Next.js、React、Tailwind CSS、Markdown 解析器等）。

## ▶️ 第二步：启动开发服务器

```bash
npm run dev
```

启动成功后，终端会显示：

```
- Local:        http://localhost:2077
- ready started server on 0.0.0.0:2077, url: http://localhost:2077
```

## 🌐 第三步：在浏览器中查看

打开浏览器访问：

- **首页**: http://localhost:2077
- **LSP 文章详情页**: http://localhost:2077/articles/lsp-liskov-substitution-principle

## 📱 第四步：测试移动端效果

1. 打开浏览器开发者工具（F12）
2. 点击设备工具栏图标（Ctrl+Shift+M）
3. 选择手机型号（如 iPhone 12、Samsung Galaxy）
4. 查看移动端响应式效果

## ✅ 预期效果

### 首页
- 显示所有文章的卡片列表
- 卡片包含封面图、标题、摘要、分类、标签
- 显示多媒体资源图标（🎥视频、🎧音频、📄PPT等）

### 文章详情页
- ✅ 封面图显示
- ✅ 标题、作者、日期、分类、标签
- ✅ 视频播放器（支持移动端内联播放）
- ✅ 音频播放器（HTML5 原生控件）
- ✅ 文章正文（Markdown 渲染，代码高亮）
- ✅ PDF 查看器（桌面端嵌入，移动端下载）
- ✅ 思维导图（点击放大查看）
- ✅ 问答卡片（交互式学习工具）

## 🐛 常见问题

### 1. 依赖安装失败

```bash
# 清除缓存后重新安装
npm cache clean --force
npm install
```

### 2. 端口被占用

如果 2077 端口已被占用，可以指定其他端口：

```bash
npm run dev -- -p 3001
```

或者修改 `package.json` 中的 dev 脚本：
```json
"dev": "next dev -p 你想要的端口号"
```

### 3. 文章不显示

检查 `content/posts/` 目录是否存在，以及文章文件夹结构是否正确。

### 4. 视频/音频无法播放

- 确保文件格式正确（mp4/m4a）
- 检查文件路径是否正确
- 查看浏览器控制台是否有错误信息

## 🎨 自定义配置

### 修改网站标题和描述

编辑 `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: '你的博客标题',
  description: '你的博客描述',
};
```

### 修改主题颜色

编辑 `tailwind.config.js` 中的 `theme.extend` 部分。

### 添加新文章

1. 在 `content/posts/` 创建新文件夹（使用 slug 命名）
2. 创建 `index.md` 文件，包含 Front Matter 和正文
3. 添加资源文件（图片、视频等）
4. 重启开发服务器

## 📦 构建生产版本

```bash
npm run build
npm start
```

## 🚀 部署到 Vercel（免费）

1. 将代码推送到 GitHub
2. 访问 https://vercel.com
3. 点击"Import Project"
4. 选择你的 GitHub 仓库
5. 自动检测 Next.js 并部署

## 📚 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **Markdown**: gray-matter + remark
- **CSV 解析**: PapaParse
- **部署**: Vercel / GitHub Pages

## 🎯 下一步

- [ ] 添加更多文章
- [ ] 实现搜索功能
- [ ] 添加分类和标签筛选
- [ ] 优化 SEO（sitemap、meta 标签）
- [ ] 添加评论系统（Giscus/Disqus）
- [ ] 统计访问量（Google Analytics）

---

## 💡 提示

- 文章使用 Markdown 编写，存放在 Git 仓库中，无需数据库
- 所有资源文件与文章放在同一文件夹，便于管理
- 移动优先设计，手机端体验优秀
- 完全静态化，访问速度极快

有问题？查看 Next.js 官方文档：https://nextjs.org/docs
