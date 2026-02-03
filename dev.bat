@echo off
chcp 65001 >nul
echo ========================================
echo   清理 2077 端口并启动开发服务器
echo ========================================
echo.

echo [1/2] 正在检查并清理 2077 端口...

:: 查找占用2077端口的进程并杀掉
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":2077" ^| findstr "LISTENING"') do (
    echo 发现占用端口的进程 PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    if !errorlevel! equ 0 (
        echo 已成功终止进程 PID: %%a
    ) else (
        echo 进程 %%a 可能已经终止
    )
)

echo 端口 2077 已清理完毕
echo.

echo [2/2] 正在启动开发服务器...
echo.

npm run dev
