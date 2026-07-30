@echo off
setlocal
title Mineflayer Minecraft Agent

cd /d "%~dp0"

echo ==========================================
echo       Mineflayer Minecraft Agent
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js was not found.
    echo Install Node.js 20 LTS from https://nodejs.org/
    echo Then close and reopen this script.
    echo.
    pause
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo [ERROR] npm was not found.
    echo Reinstall Node.js 20 LTS and enable the Add to PATH option.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules\mineflayer" (
    echo [INFO] Dependencies are not installed. Running npm install...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] npm install failed.
        echo Check the error message above, then press any key to close.
        pause
        exit /b 1
    )
)

if not exist "node_modules\mineflayer-pvp" (
    echo [INFO] New dependencies were detected. Running npm install...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

set "MC_HOST=localhost"
set "MC_PORT=25565"
set "MC_USERNAME=CourseAgent"
set "VIEWER_PORT=3007"
set "TARGET_PLAYER="

set /p "INPUT_HOST=Server address [localhost]: "
if defined INPUT_HOST set "MC_HOST=%INPUT_HOST%"

set /p "INPUT_PORT=Server port [25565]: "
if defined INPUT_PORT set "MC_PORT=%INPUT_PORT%"

set /p "INPUT_BOT=Bot name [CourseAgent]: "
if defined INPUT_BOT set "MC_USERNAME=%INPUT_BOT%"

set /p "TARGET_PLAYER=Target player name (required): "
if not defined TARGET_PLAYER (
    echo.
    echo [ERROR] Target player name cannot be empty.
    pause
    exit /b 1
)

echo.
echo [INFO] Server : %MC_HOST%:%MC_PORT%
echo [INFO] Bot    : %MC_USERNAME%
echo [INFO] Target : %TARGET_PLAYER%
echo [INFO] Viewer : http://localhost:%VIEWER_PORT%
echo.
echo Starting agent. Press Ctrl+C to stop.
echo.

call npm start

echo.
echo Agent stopped.
pause

