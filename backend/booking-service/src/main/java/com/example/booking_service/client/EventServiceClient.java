package com.example.booking_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "event-service")
public interface EventServiceClient {

    @PostMapping("/events/{eventId}/reserve/{seatNumber}")
    void reserveSeat(@PathVariable Long eventId,
                     @PathVariable String seatNumber);

    @PostMapping("/events/{eventId}/release/{seatNumber}")
    void releaseSeat(@PathVariable Long eventId,
                     @PathVariable String seatNumber);
}