package com.example.waitlist_service.controller;


import com.example.waitlist_service.redis.WaitlistRedisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/waitlist")
@RequiredArgsConstructor
public class WaitlistController {

    private final WaitlistRedisRepository waitlistRepository;

    @PostMapping("/{eventId}/{userId}")
    public String joinWaitlist(@PathVariable Long eventId,
                               @PathVariable Long userId) {

        waitlistRepository.addUserToWaitlist(eventId, userId);

        return "User added to waitlist";
    }
}