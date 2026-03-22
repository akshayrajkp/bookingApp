package com.example.waitlist_service.controller;


import com.example.waitlist_service.redis.WaitlistRedisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{eventId}/check")
    public List<Object> checkWaitlist(@PathVariable Long eventId) {
        String key = "event:" + eventId + ":waitlist";
        return waitlistRepository.getAllUsers(eventId);
    }
}