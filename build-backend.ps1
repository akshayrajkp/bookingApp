$services = "api-gateway", "booking-service", "event-service", "notification-service", "service-registry", "user-service", "waitlist-service"

foreach ($service in $services) {
    Write-Host "============================="
    Write-Host "Building $service..." -ForegroundColor Cyan
    Write-Host "============================="
    Set-Location ".\backend\$service"
    
    # Run maven build
    mvn clean package -DskipTests
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed for $service!" -ForegroundColor Red
        exit $LASTEXITCODE
    }
    
    # Return to root directory
    Set-Location "..\.."
}

Write-Host "`nAll backend services built successfully!" -ForegroundColor Green
