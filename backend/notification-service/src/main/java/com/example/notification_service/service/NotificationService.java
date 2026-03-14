package com.example.notification_service.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendNotification(String message){

        // simulate email sending
        System.out.println("Sending notification to user...");

        System.out.println("MESSAGE: " + message);

        System.out.println("Notification sent successfully.");
    }
}