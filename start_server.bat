@echo off
setlocal
cd /d "%~dp0"

where python >nul 2>nul
if errorlevel 1 (
    echo Python was not found. Install Python and make sure it is on PATH.
    pause
    exit /b 1
)

python "%~dp0start.py"
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
    echo The Velfira servers stopped with exit code %EXIT_CODE%.
) else (
    echo The Velfira servers have stopped.
)

pause
exit /b %EXIT_CODE%
