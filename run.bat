@echo off
title Future Leaders School Website Server
echo ========================================================
echo   FUTURE LEADERS SCHOOL - STARTING LOCAL SERVER
echo ========================================================
cd /d "C:\Users\ELE\.gemini\antigravity\scratch\future-leaders-school"

echo Starting server on http://localhost:5173 ...
start "" "http://localhost:5173/admin"
npm run dev -- --port 5173 --host
pause
