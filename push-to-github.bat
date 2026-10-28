@echo off
title Push Future Leaders School to GitHub
color 0B
echo ========================================================
echo    Pushing Future Leaders School to GitHub Repository:
echo    https://github.com/mdobidullah10/School-management.git
echo ========================================================
echo.

cd /d "%~dp0"

echo Checking remote configuration...
git remote set-url origin https://github.com/mdobidullah10/School-management.git
git branch -M main

echo.
echo Running: git push -u origin main
echo (If a GitHub sign-in window appears, please click 'Sign in with your browser')
echo.

git push -u origin main

echo.
if %errorlevel% equ 0 (
    echo ========================================================
    echo  SUCCESS! All school project files pushed to GitHub!
    echo ========================================================
) else (
    echo ========================================================
    echo  PUSH FAILED!
    echo ========================================================
)

echo.
pause
