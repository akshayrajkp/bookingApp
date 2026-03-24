package com.example.notification_service.kafka;

import com.example.notification_service.dto.BookingEventDTO;
import com.example.notification_service.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationConsumer {

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "waitlist-promoted", groupId = "notification-group")
    public void handlePromotion(Object message){
        System.out.println("Received event: " + message);
        notificationService.sendNotification(message.toString());
    }

    @KafkaListener(topics = "booking-created", groupId = "notification-group")
    public void handleBookingCreated(Object message) {
        System.out.println("Received booking-created event: " + message);
        try {
            BookingEventDTO event = objectMapper.convertValue(message, BookingEventDTO.class);
            notificationService.sendBookingSuccessEmail(event);
        } catch (Exception e) {
            System.err.println("Failed to parse booking event: " + e.getMessage());
        }
    }
}