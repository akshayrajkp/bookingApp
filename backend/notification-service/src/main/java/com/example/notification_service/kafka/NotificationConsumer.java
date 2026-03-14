package com.example.notification_service.kafka;

import com.example.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationConsumer {

    private final NotificationService notificationService;

    @KafkaListener(topics = "waitlist-promoted", groupId = "notification-group")
    public void handlePromotion(String message){

        System.out.println("Received event: " + message);

        notificationService.sendNotification(message);
    }

}