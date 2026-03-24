package com.example.notification_service.kafka;

import com.example.notification_service.dto.BookingEventDTO;
import com.example.notification_service.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationConsumer {

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "waitlist-promoted", groupId = "notification-group")
    public void handlePromotion(ConsumerRecord<String, Object> record){
        System.out.println("Received event: " + record.value());
        notificationService.sendNotification(record.value().toString());
    }

    @KafkaListener(topics = "booking-created", groupId = "notification-group")
    public void handleBookingCreated(ConsumerRecord<String, Object> record) {
        System.out.println("Received booking-created event payload: " + record.value());
        try {
            Object value = record.value();
            BookingEventDTO event;
            if (value instanceof String) {
                event = objectMapper.readValue((String) value, BookingEventDTO.class);
            } else {
                event = objectMapper.convertValue(value, BookingEventDTO.class);
            }
            notificationService.sendBookingSuccessEmail(event);
        } catch (Exception e) {
            System.err.println("Failed to parse booking event: " + e.getMessage());
        }
    }
}