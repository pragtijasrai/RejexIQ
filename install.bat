@echo off
echo ========================================
echo RejexIQ - Installation Script
echo ========================================
echo.

echo [1/3] Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [3/3] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Open TWO terminal windows
echo 2. In Terminal 1, run: npm run server
echo 3. In Terminal 2, run: npm run dev
echo 4. Open browser to: http://localhost:5173
echo ========================================
echo.
pause
