package com.example.notification_service.controller;

import com.example.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public String send(@RequestBody String message){

        notificationService.sendNotification(message);

        return "Notification sent";
    }
}