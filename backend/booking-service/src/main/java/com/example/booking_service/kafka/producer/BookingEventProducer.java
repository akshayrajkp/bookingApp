package com.example.booking_service.kafka.producer;

import lombok.RequiredArgsConstructor;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendBookingCreatedEvent(Object event) {
        kafkaTemplate.send("booking-created", event);
    }

    public void sendBookingCancelledEvent(Object event) {
        kafkaTemplate.send("booking-cancelled", event);
    }
}