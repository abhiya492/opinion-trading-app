# Docker Setup Script for Windows
Write-Host "Setting up Docker environment for Opinion Trading App..." -ForegroundColor Cyan

# Function to retry commands
function Invoke-CommandWithRetry {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Command,
        [int]$MaxAttempts = 3,
        [int]$DelaySeconds = 10
    )

    for ($i = 1; $i -le $MaxAttempts; $i++) {
        Write-Host "Attempting $Command (attempt $i of $MaxAttempts)..." -ForegroundColor Yellow
        try {
            Invoke-Expression $Command
            if ($LASTEXITCODE -eq 0) {
                return $true
            }
        }
        catch {
            Write-Host "Error occurred: $_" -ForegroundColor Red
        }
        
        if ($i -lt $MaxAttempts) {
            Write-Host "Command failed, waiting $DelaySeconds seconds before retry..." -ForegroundColor Yellow
            Start-Sleep -Seconds $DelaySeconds
        }
    }
    
    Write-Host "Command failed after $MaxAttempts attempts" -ForegroundColor Red
    return $false
}

# Check Docker is running
$dockerRunning = $false
try {
    $dockerInfo = docker info 2>&1
    if ($dockerInfo -match "Server:") {
        $dockerRunning = $true
        Write-Host "✓ Docker is running properly" -ForegroundColor Green
    }
}
catch {
    Write-Host "× Error checking Docker status" -ForegroundColor Red
    $dockerRunning = $false
}

if (-not $dockerRunning) {
    Write-Host "⚠ Docker is not running properly. Starting Docker Desktop..." -ForegroundColor Yellow
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Write-Host "Waiting 45 seconds for Docker to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 45
}

# Clean up any existing containers and images
Write-Host "Cleaning up Docker environment..." -ForegroundColor Cyan
docker system prune -f

# Set up MongoDB first
Write-Host "Pulling MongoDB image..." -ForegroundColor Cyan
if (-not (Invoke-CommandWithRetry -Command "docker pull mongo:latest")) {
    Write-Host "Failed to pull MongoDB image. Please check your internet connection and try again." -ForegroundColor Red
    exit 1
}

# Build the containers separately
Write-Host "Building backend container..." -ForegroundColor Cyan
if (-not (Invoke-CommandWithRetry -Command "docker build -f Dockerfile.dev -t opinion-backend:dev .")) {
    Write-Host "Failed to build backend container. Please check the error messages above." -ForegroundColor Red
    exit 1
}

Write-Host "Building frontend container..." -ForegroundColor Cyan
Push-Location frontend
if (-not (Invoke-CommandWithRetry -Command "docker build -f Dockerfile.dev -t opinion-frontend:dev .")) {
    Write-Host "Failed to build frontend container. Please check the error messages above." -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

# Start the services
Write-Host "Starting services with docker-compose..." -ForegroundColor Cyan
docker-compose up

Write-Host "Setup complete! Access the app at http://localhost:3000" -ForegroundColor Green 