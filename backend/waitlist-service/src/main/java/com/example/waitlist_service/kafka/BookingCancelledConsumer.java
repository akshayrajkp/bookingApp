package com.example.waitlist_service.kafka;


import com.example.waitlist_service.service.WaitlistService;
import lombok.RequiredArgsConstructor;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingCancelledConsumer {

    private final WaitlistService waitlistService;

    @KafkaListener(topics = "booking-cancelled", groupId = "waitlist-group")
    public void consume(String message) {

        System.out.println("Received cancellation event: " + message);

        // Example message parsing
        Long eventId = Long.parseLong(message);

        waitlistService.promoteNextUser(eventId);
    }
}