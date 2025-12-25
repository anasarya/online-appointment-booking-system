@echo off
echo ========================================
echo  MongoDB Installation Guide for Windows
echo ========================================
echo.

echo Step 1: Download MongoDB Community Server
echo Go to: https://www.mongodb.com/try/download/community
echo Select: Windows x64 MSI
echo.
pause

echo Step 2: Install MongoDB
echo - Run the downloaded .msi file
echo - Choose "Complete" installation
echo - Check "Install MongoDB as a Windows Service"
echo - Check "Install MongoDB Compass"
echo - Click Install
echo.
pause

echo Step 3: Verify Installation
echo Opening Command Prompt to test...
echo.
start cmd /k "mongosh && echo MongoDB is working! && pause"

echo.
echo Step 4: If MongoDB is working, press any key to continue...
pause

echo Step 5: Testing connection with your app...
node test-mongodb.js

echo.
echo Step 6: Seed the database...
npm run seed

echo.
echo ========================================
echo  MongoDB Setup Complete!
echo ========================================
echo.
echo Your system is now ready with MongoDB!
echo Run: npm run dev
echo.
pause