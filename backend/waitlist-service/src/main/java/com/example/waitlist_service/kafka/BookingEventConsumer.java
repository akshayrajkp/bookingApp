package com.example.waitlist_service.kafka;

import com.example.waitlist_service.service.WaitlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingEventConsumer {

    private final WaitlistService waitlistService;

    @KafkaListener(topics = "booking-cancelled", groupId = "waitlist-group")
    public void onBookingCancelled(String message) {
        System.out.println("Received booking-cancelled: " + message);
        try {
            // strip quotes if JSON serialized e.g. "\"12\"" → "12"
            String cleaned = message.replaceAll("\"", "").trim();
            Long eventId = Long.parseLong(cleaned);
            waitlistService.promoteNextUser(eventId);
        } catch (Exception e) {
            System.err.println("Error processing event: " + e.getMessage());
        }
    }
}