package com.example.booking_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "event-service")
public interface EventServiceClient {

    @GetMapping("/events/{eventId}/availability")
    Boolean checkAvailability(@PathVariable Long eventId);

    @PostMapping("/events/{eventId}/reserve")
    String reserveSeat(@PathVariable Long eventId, @RequestParam String seat);

    @PostMapping("/events/{eventId}/release")
    String releaseSeat(@PathVariable Long eventId, @RequestParam String seat);
}