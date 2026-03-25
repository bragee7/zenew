@echo off
title Women Safety Guardian - Quick Start

echo ========================================
echo Women Safety Guardian - Quick Start
echo ========================================
echo.

echo [1/3] Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm run dev"

echo [2/3] Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo [3/3] Starting Frontend Development Server...
start "Frontend Server" cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo Application is starting...
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Demo Accounts:
echo Police: police@guardian.com / police123
echo User: user@guardian.com / user123
echo.
echo Press any key to open the application...
pause > nul

start http://localhost:3000

echo Done! The application should now be open in your browser.
