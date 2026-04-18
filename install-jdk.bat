@echo off
echo ========================================
echo Installing JDK 17 for E-Commerce Project
echo ========================================
echo.

echo Checking Chocolatey...
choco --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Chocolatey not found!
    echo.
    echo Please download JDK 17 manually:
    echo 1. Visit: https://adoptium.net/temurin/releases/?version=17
    echo 2. Download Windows x64 MSI installer
    echo 3. Run the installer
    echo 4. Then run: run-backend.bat
    echo.
    start https://adoptium.net/temurin/releases/?version=17
    pause
    exit /b 1
)

echo Chocolatey found!
echo.
echo Installing JDK 17 (requires admin privileges)...
echo Please approve the admin prompt if it appears.
echo.

choco install temurin17 -y

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo JDK 17 installed successfully!
    echo ========================================
    echo.
    echo Verifying installation...
    java -version
    javac -version
    echo.
    echo Ready to run! Execute: run-backend.bat
) else (
    echo.
    echo Installation failed or was cancelled.
    echo Please install manually from: https://adoptium.net/temurin/releases/?version=17
    start https://adoptium.net/temurin/releases/?version=17
)

pause
