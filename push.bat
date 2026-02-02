@echo off
chcp 65001 >nul
echo ========================================
echo    GitHub 一键推送脚本
echo ========================================
echo.

REM 检查是否已初始化Git仓库
if not exist .git (
    echo [步骤 1/5] 初始化 Git 仓库...
    git init
    if errorlevel 1 (
        echo ❌ Git 初始化失败！请检查是否安装了 Git
        pause
        exit /b 1
    )
    echo ✅ Git 仓库初始化成功
    echo.
    
    echo [步骤 2/5] 添加远程仓库...
    git remote add origin https://github.com/LarryPatton/LearningShare.git
    if errorlevel 1 (
        echo ❌ 添加远程仓库失败！
        pause
        exit /b 1
    )
    echo ✅ 远程仓库添加成功
    echo.
) else (
    echo [步骤 1/5] Git 仓库已存在，跳过初始化
    echo.
    
    REM 检查远程仓库是否已添加
    git remote -v | findstr "origin" >nul
    if errorlevel 1 (
        echo [步骤 2/5] 添加远程仓库...
        git remote add origin https://github.com/LarryPatton/LearningShare.git
        echo ✅ 远程仓库添加成功
        echo.
    ) else (
        echo [步骤 2/5] 远程仓库已存在，跳过添加
        echo.
    )
)

echo [步骤 3/5] 添加所有文件到暂存区...
git add .
if errorlevel 1 (
    echo ❌ 添加文件失败！
    pause
    exit /b 1
)
echo ✅ 文件添加成功
echo.

echo [步骤 4/5] 提交更改...
REM 生成带时间戳的commit消息
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set commit_msg=更新于 %datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%
git commit -m "%commit_msg%"
if errorlevel 1 (
    echo ⚠️  没有需要提交的更改
    echo.
) else (
    echo ✅ 提交成功：%commit_msg%
    echo.
)

echo [步骤 5/5] 推送到 GitHub...
git push -u origin main
if errorlevel 1 (
    echo.
    echo ⚠️  推送到 main 分支失败，尝试推送到 master 分支...
    git push -u origin master
    if errorlevel 1 (
        echo.
        echo ❌ 推送失败！可能的原因：
        echo    1. 网络连接问题
        echo    2. GitHub 认证失败（需要配置 SSH 密钥或 Personal Access Token）
        echo    3. 分支名称不正确
        echo.
        echo 💡 提示：
        echo    - 请检查你的 GitHub 登录状态
        echo    - 确保已配置 Git 用户名和邮箱：
        echo      git config --global user.name "你的名字"
        echo      git config --global user.email "你的邮箱"
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo ✅ 推送成功！
echo ========================================
echo.
echo 查看远程仓库：https://github.com/LarryPatton/LearningShare
echo.
pause
