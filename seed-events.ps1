$baseUrl = "http://localhost:8080/events"

function Get-SeatNames([int]$total) {
    $seats = @()
    for ($i = 0; $i -lt $total; $i++) {
        $rowVal = [int](65 + [math]::Floor($i / 5))
        $row = [char]$rowVal
        $col = ($i % 5) + 1
        $seats += "$row$col"
    }
    return $seats
}

$events = @(
    @{
        name = "Rock Revolution 2026 (Fix)"
        location = "Madison Square Garden, NY"
        category = "Concert"
        price = 75.0
        description = "An explosive night of rock and roll featuring the world's top bands."
        eventTime = "2026-06-20T19:00:00"
        totalSeats = 20
        availableSeats = Get-SeatNames 20
        images = @("https://images.unsplash.com/photo-1540039155733-5bb30b53aa14")
    },
    @{
        name = "Tech Innovators Summit (Fix)"
        location = "Convention Center, SF"
        category = "Conference"
        price = 250.0
        description = "Explore the future of AI, Robotics, and Green Tech with industry leaders."
        eventTime = "2026-09-15T09:00:00"
        totalSeats = 15
        availableSeats = Get-SeatNames 15
        images = @("https://images.unsplash.com/photo-1505373877841-8d25f7d46678")
    }
)

foreach ($event in $events) {
    $json = $event | ConvertTo-Json -Depth 5
    Write-Host "Creating event: $($event.name)..."
    try {
        Invoke-RestMethod -Uri $baseUrl -Method Post -Body $json -ContentType "application/json"
        Write-Host "Success!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to create event: $_" -ForegroundColor Red
    }
}
