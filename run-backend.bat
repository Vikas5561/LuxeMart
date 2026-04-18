@echo off
echo ========================================
echo E-Commerce Backend Server
echo ========================================
echo.

echo Checking Java installation...
set "JAVA_HOME=C:\Users\vikas\.jdks\azul-21.0.7"
if exist "%JAVA_HOME%\bin\java.exe" (
    echo Found local JDK at %JAVA_HOME%
    set "PATH=%JAVA_HOME%\bin;%PATH%"
)

java -version 2>nul
if %errorlevel% neq 0 (
    echo Java not found!
    echo Please ensure Java is installed or update this script with your JDK path.
    pause
    exit /b 1
)

echo.
javac -version 2>nul
if %errorlevel% neq 0 (
    echo Java Compiler not found!
    echo You have JRE but need JDK
    echo Please run install-jdk.bat first
    pause
    exit /b 1
)

echo Java installation verified!
echo.

cd ecommerce-backend

echo Building backend...
call mvn clean install -DskipTests

if %errorlevel% neq 0 (
    echo.
    echo Build failed! Check error messages above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Starting Spring Boot Server...
echo ========================================
echo.
echo Server will start on: http://localhost:8080
echo H2 Console: http://localhost:8080/h2-console
echo API Base: http://localhost:8080/api
echo.
echo Press Ctrl+C to stop the server
echo.

call mvn spring-boot:run
