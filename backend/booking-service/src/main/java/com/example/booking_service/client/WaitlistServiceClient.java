package com.example.booking_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "waitlist-service")
public interface WaitlistServiceClient {

    // POST /waitlist/{eventId}/{userId}
    @PostMapping("/waitlist/{eventId}/{userId}")
    String joinWaitlist(@PathVariable Long eventId, @PathVariable Long userId);
}