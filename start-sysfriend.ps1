Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "         SYSFRIEND - AI DESKTOP CONTROLLER              " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

$nodeVersion = node -v
Write-Host "[1/3] Node.js detected: $nodeVersion" -ForegroundColor Green

$agentDir = Join-Path $PSScriptRoot "desktop-agent"
Set-Location $agentDir

if (-not (Test-Path "node_modules")) {
    Write-Host "[2/3] Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "[2/3] Dependencies verified." -ForegroundColor Green
}

Write-Host "[3/3] Starting SysFriend server on http://localhost:3000..." -ForegroundColor Green
Start-Process "http://localhost:3000"
node server.js
