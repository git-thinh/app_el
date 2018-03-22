@ECHO OFF

echo.
cd C:\nginx
nginx -s stop
taskkill /F /IM nginx.exe
start nginx

tasklist /fi "imagename eq nginx.exe"

echo.
echo [ RUNING: http://localhost ...]
echo.