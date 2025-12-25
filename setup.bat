@echo off
echo ========================================
echo  Online Appointment Booking System Setup
echo ========================================
echo.

echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies!
    pause
    exit /b 1
)
cd ..

echo.
echo Setting up Tailwind CSS...
cd client
call npx tailwindcss init -p
cd ..

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Copy .env.example to .env and configure your settings
echo 3. Run 'node scripts/seedDatabase.js' to create sample data
echo 4. Run 'npm run dev' to start the application
echo.
echo Demo accounts will be created:
echo - Admin: admin@demo.com / password123
echo - Staff: staff@demo.com / password123  
echo - Customer: customer@demo.com / password123
echo.
pause