# GitHub 自动推送脚本使用说明

## 📦 包含文件

- `push.bat` - Windows 批处理脚本（推荐）
- `push.ps1` - PowerShell 脚本（需要执行策略权限）
- `.gitignore` - Git 忽略文件配置

## 🚀 快速开始

### 方法一：使用批处理脚本（最简单）

1. **双击运行** `push.bat` 文件
2. 脚本会自动完成以下操作：
   - 初始化 Git 仓库（如果还没初始化）
   - 添加远程仓库（如果还没添加）
   - 添加所有文件到暂存区
   - 提交更改（自动生成时间戳消息）
   - 推送到 GitHub

### 方法二：使用 PowerShell 脚本

1. **右键点击** `push.ps1` → 选择"使用 PowerShell 运行"
2. 如果遇到执行策略错误，请先运行：
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

## ⚙️ 首次使用前的配置

如果你是第一次使用 Git，需要先配置用户名和邮箱：

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"
```

## 🔐 GitHub 认证

### 方式一：HTTPS + Personal Access Token（推荐）

1. 访问：https://github.com/settings/tokens
2. 点击"Generate new token (classic)"
3. 勾选 `repo` 权限
4. 生成 Token 并复制
5. 第一次推送时，输入：
   - Username: 你的GitHub用户名
   - Password: 粘贴刚才的 Token（不是密码！）

### 方式二：SSH 密钥

1. 生成 SSH 密钥：
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
2. 将公钥添加到 GitHub：https://github.com/settings/keys
3. 修改脚本中的仓库地址为 SSH 格式：
   ```
   git@github.com:LarryPatton/LearningShare.git
   ```

## 📝 文件说明

### `.gitignore`

已配置忽略以下文件/目录：
- `node_modules/` - NPM 依赖
- `.next/` - Next.js 构建缓存
- `.env*` - 环境变量文件
- `*.log` - 日志文件
- IDE 配置文件

如需添加其他忽略规则，直接编辑 `.gitignore` 文件即可。

## 🛠️ 常见问题

### Q1: 推送失败，提示认证错误？

**答**：从 2021 年 8 月起，GitHub 不再支持密码认证，必须使用 Personal Access Token 或 SSH 密钥。

### Q2: 提示"没有需要提交的更改"？

**答**：这说明自上次提交后没有修改任何文件，这是正常现象。

### Q3: 推送到 main 还是 master 分支？

**答**：脚本会自动尝试，先推送到 `main`，如果失败则尝试 `master`。

### Q4: 如何修改 commit 消息格式？

**答**：编辑脚本中的这一行：
```batch
REM push.bat
set commit_msg=更新于 %datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%
```

```powershell
# push.ps1
$commitMsg = "更新于 $timestamp"
```

### Q5: 能否只推送特定文件？

**答**：当前脚本推送所有更改。如需推送特定文件，修改：
```bash
git add .  # 改为 git add 文件名
```

## 📚 Git 常用命令

```bash
# 查看状态
git status

# 查看提交历史
git log --oneline

# 查看远程仓库
git remote -v

# 拉取远程更新
git pull

# 查看所有分支
git branch -a

# 切换分支
git checkout 分支名
```

## 🎯 推荐工作流

1. **修改代码**
2. **双击 `push.bat`** 一键推送
3. **查看 GitHub** 确认更新成功

## 📞 获取帮助

- GitHub 文档：https://docs.github.com/
- Git 官方文档：https://git-scm.com/doc
- Git 可视化学习：https://learngitbranching.js.org/

---

**提示**：建议每次修改完代码后立即推送，避免丢失工作成果！
