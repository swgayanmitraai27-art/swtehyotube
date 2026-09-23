@echo off
echo ========================================================
echo   SKILLWINNER - ANDROID APK BUILD SCRIPT (<4MB APK)
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Installing Dependencies...
call npm install

echo [2/3] Building Production Assets...
call npm run build

echo [3/3] Syncing with Android Project...
call npx cap sync android

echo.
echo ========================================================
echo   BUILD COMPLETED! 
echo   To open Android Studio and generate final APK:
echo   Run: npx cap open android
echo ========================================================
pause
