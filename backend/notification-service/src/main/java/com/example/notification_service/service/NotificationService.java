package com.example.notification_service.service;

import com.example.notification_service.client.EventServiceClient;
import com.example.notification_service.client.UserServiceClient;
import com.example.notification_service.dto.BookingEventDTO;
import com.example.notification_service.dto.EventDTO;
import com.example.notification_service.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;
    private final UserServiceClient userServiceClient;
    private final EventServiceClient eventServiceClient;

    public void sendBookingSuccessEmail(BookingEventDTO bookingEvent) {
        try {
            // Fetch User
            UserDTO user = userServiceClient.getUserById(bookingEvent.getUserId());
            // Fetch Event
            EventDTO event = eventServiceClient.getEventById(bookingEvent.getEventId());

            System.out.println("Sending email to " + user.getEmail() + " for event " + event.getTitle());

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Booking Confirmation: " + event.getTitle());
            message.setText("Hi " + user.getFirstName() + ",\n\n" +
                    "Your booking for '" + event.getTitle() + "' has been confirmed!\n" +
                    "Quantity: " + bookingEvent.getQuantity() + "\n" +
                    "Total Amount: $" + bookingEvent.getTotalAmount() + "\n\n" +
                    "Thank you for booking with us!");
            
            mailSender.send(message);
            System.out.println("Booking success email sent to " + user.getEmail());

        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendNotification(String message){
        System.out.println("Sending notification to user...");
        System.out.println("MESSAGE: " + message);
        System.out.println("Notification sent successfully.");
    }
}