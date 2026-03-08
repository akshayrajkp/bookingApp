package com.example.waitlist_service.service;

import com.example.waitlist_service.redis.WaitlistRedisRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WaitlistService {

    private final WaitlistRedisRepository waitlistRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public void promoteNextUser(Long eventId) {

        Long userId = waitlistRepository.getNextUser(eventId);

        if (userId == null) {
            System.out.println("No users in waitlist");
            return;
        }

        System.out.println("Promoting user: " + userId);

        kafkaTemplate.send("waitlist-promoted",
                "User " + userId + " promoted for event " + eventId);
    }
}
