@echo off
chcp 65001 >nul
echo 正在启动新手调音台教学网页...
echo.
echo ① 本机直接用浏览器打开：  http://localhost:8080
echo ② 手机访问： 请先在下方显示的 "手机访问" 地址打开
echo     （手机需连接和电脑同一个 WiFi）
echo.
echo 按 Ctrl + C 可停止服务
echo.
node server.js
pause
