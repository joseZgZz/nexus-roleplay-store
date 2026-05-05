@echo off
start "Backend" cmd /k "cd backend && node index.js"
start "Bot" cmd /k "cd bot && node index.js"
start "Frontend" cmd /k "cd frontend && npm run dev"
