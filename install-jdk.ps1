# Install JDK 17 - PowerShell Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing JDK 17 for E-Commerce App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Chocolatey is installed
if (Get-Command choco -ErrorAction SilentlyContinue) {
    Write-Host "✓ Chocolatey found. Installing JDK 17..." -ForegroundColor Green
    choco install temurin17 -y
    
    # Refresh environment
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    Write-Host ""
    Write-Host "✓ JDK 17 installed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verifying installation..." -ForegroundColor Yellow
    java -version
    javac -version
} else {
    Write-Host "Chocolatey not found. Please install JDK manually:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Download directly" -ForegroundColor Cyan
    Write-Host "  1. Visit: https://adoptium.net/temurin/releases/?version=17" -ForegroundColor White
    Write-Host "  2. Download Windows x64 MSI installer" -ForegroundColor White
    Write-Host "  3. Run the installer" -ForegroundColor White
    Write-Host "  4. Restart PowerShell" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2: Install Chocolatey first (recommended)" -ForegroundColor Cyan
    Write-Host "  Run this in PowerShell (Admin):" -ForegroundColor White
    Write-Host '  Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString("https://community.chocolatey.org/install.ps1"))' -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Then run this script again." -ForegroundColor White
    Write-Host ""
    Write-Host "Opening download page in browser..." -ForegroundColor Yellow
    Start-Process "https://adoptium.net/temurin/releases/?version=17"
}

Write-Host ""
Write-Host "After JDK is installed, run: .\run-backend.ps1" -ForegroundColor Green
