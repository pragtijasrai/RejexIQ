@echo off
echo Starting RejexIQ Development Servers...
echo.
echo Opening Backend Server in new window...
start "RejexIQ Backend" cmd /k "npm run server"

timeout /t 3 /nobreak > nul

echo Opening Frontend Dev Server in new window...
start "RejexIQ Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul
