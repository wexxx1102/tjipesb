@echo off
chcp 65001 >nul
cd /d %~dp0

echo [1/2] 安装 PyInstaller
py -m pip install pyinstaller

echo [2/2] 开始打包
py -m PyInstaller --clean tjipe_touchscreen.spec

echo.
echo 打包完成，输出目录：
echo %~dp0dist\天津知识产权交易中心触摸屏展示软件
pause
