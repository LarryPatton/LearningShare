# GitHub 一键推送脚本 (PowerShell 版本)
# 编码：UTF-8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   GitHub 一键推送脚本 (PowerShell)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查Git是否安装
try {
    git --version | Out-Null
} catch {
    Write-Host "❌ 错误：未检测到 Git！" -ForegroundColor Red
    Write-Host "请先安装 Git: https://git-scm.com/download/win" -ForegroundColor Yellow
    pause
    exit 1
}

# 检查是否已初始化Git仓库
if (-not (Test-Path ".git")) {
    Write-Host "[步骤 1/5] 初始化 Git 仓库..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Git 初始化失败！" -ForegroundColor Red
        pause
        exit 1
    }
    Write-Host "✅ Git 仓库初始化成功" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "[步骤 2/5] 添加远程仓库..." -ForegroundColor Yellow
    git remote add origin https://github.com/LarryPatton/LearningShare.git
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 添加远程仓库失败！" -ForegroundColor Red
        pause
        exit 1
    }
    Write-Host "✅ 远程仓库添加成功" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[步骤 1/5] Git 仓库已存在，跳过初始化" -ForegroundColor Gray
    Write-Host ""
    
    # 检查远程仓库是否已添加
    $remotes = git remote -v
    if ($remotes -notmatch "origin") {
        Write-Host "[步骤 2/5] 添加远程仓库..." -ForegroundColor Yellow
        git remote add origin https://github.com/LarryPatton/LearningShare.git
        Write-Host "✅ 远程仓库添加成功" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "[步骤 2/5] 远程仓库已存在，跳过添加" -ForegroundColor Gray
        Write-Host ""
    }
}

# 添加文件
Write-Host "[步骤 3/5] 添加所有文件到暂存区..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 添加文件失败！" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "✅ 文件添加成功" -ForegroundColor Green
Write-Host ""

# 提交更改
Write-Host "[步骤 4/5] 提交更改..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMsg = "更新于 $timestamp"
git commit -m $commitMsg
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  没有需要提交的更改" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "✅ 提交成功：$commitMsg" -ForegroundColor Green
    Write-Host ""
}

# 推送到GitHub
Write-Host "[步骤 5/5] 推送到 GitHub..." -ForegroundColor Yellow
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "⚠️  推送到 main 分支失败，尝试推送到 master 分支..." -ForegroundColor Yellow
    git push -u origin master
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ 推送失败！可能的原因：" -ForegroundColor Red
        Write-Host "   1. 网络连接问题" -ForegroundColor Yellow
        Write-Host "   2. GitHub 认证失败（需要配置 SSH 密钥或 Personal Access Token）" -ForegroundColor Yellow
        Write-Host "   3. 分支名称不正确" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "💡 提示：" -ForegroundColor Cyan
        Write-Host "   - 请检查你的 GitHub 登录状态" -ForegroundColor White
        Write-Host "   - 确保已配置 Git 用户名和邮箱：" -ForegroundColor White
        Write-Host "     git config --global user.name `"你的名字`"" -ForegroundColor Gray
        Write-Host "     git config --global user.email `"你的邮箱`"" -ForegroundColor Gray
        pause
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ 推送成功！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "查看远程仓库：https://github.com/LarryPatton/LearningShare" -ForegroundColor Cyan
Write-Host ""
pause
