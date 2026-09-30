@echo off
title SysFriend - AI Desktop Controller
color 0B

echo ========================================================
echo          SYSFRIEND - AI DESKTOP CONTROLLER              
echo ========================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b 1
)

echo [1/3] Node.js detected:
node -v

:: Navigate to agent directory
cd /d "%~dp0desktop-agent"

:: Check if node_modules exists
if not exist "node_modules" (
    echo [2/3] Installing dependencies...
    call npm install
) else (
    echo [2/3] Dependencies verified.
)

:: Start server and open browser
echo [3/3] Starting SysFriend server on http://localhost:3000 ...
start "" "http://localhost:3000"
node server.js

pause
