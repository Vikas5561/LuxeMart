# Run E-Commerce Backend Server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting E-Commerce Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if JDK is installed
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✓ Java found: $javaVersion" -ForegroundColor Green
    
    # Check for javac (compiler)
    $javacVersion = javac -version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Java Compiler found: $javacVersion" -ForegroundColor Green
    } else {
        Write-Host "✗ Java Compiler (javac) not found!" -ForegroundColor Red
        Write-Host "  Please run: .\install-jdk.ps1" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "✗ Java not found!" -ForegroundColor Red
    Write-Host "  Please run: .\install-jdk.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Building backend..." -ForegroundColor Yellow
cd ecommerce-backend

# Clean and build
mvn clean install -DskipTests

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Starting Spring Boot Server..." -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Server will start on: http://localhost:8080" -ForegroundColor Green
    Write-Host "H2 Console: http://localhost:8080/h2-console" -ForegroundColor Green
    Write-Host "API Base: http://localhost:8080/api" -ForegroundColor Green
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    # Run the application
    mvn spring-boot:run
} else {
    Write-Host ""
    Write-Host "✗ Build failed!" -ForegroundColor Red
    Write-Host "  Check the error messages above" -ForegroundColor Yellow
    exit 1
}
