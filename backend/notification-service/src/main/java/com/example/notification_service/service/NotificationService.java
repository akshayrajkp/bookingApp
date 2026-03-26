package com.example.notification_service.service;

import com.example.notification_service.client.EventServiceClient;
import com.example.notification_service.client.UserServiceClient;
import com.example.notification_service.dto.BookingEventDTO;
import com.example.notification_service.dto.EventDTO;
import com.example.notification_service.dto.UserDTO;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;
    private final UserServiceClient userServiceClient;
    private final EventServiceClient eventServiceClient;
    private final TemplateEngine templateEngine;

    public void sendBookingSuccessEmail(BookingEventDTO bookingEvent) {
        try {
            // Fetch User
            UserDTO user = userServiceClient.getUserById(bookingEvent.getUserId());
            // Fetch Event
            EventDTO event = eventServiceClient.getEventById(bookingEvent.getEventId());

            System.out.println("Sending HTML email to " + user.getEmail() + " for event " + event.getName());

            Context context = new Context();
            context.setVariable("userName", user.getFirstName());
            context.setVariable("eventName", event.getName());
            context.setVariable("quantity", bookingEvent.getQuantity());
            context.setVariable("totalAmount", bookingEvent.getTotalAmount());
            context.setVariable("seats", bookingEvent.getSeats());
            context.setVariable("paymentMethod", bookingEvent.getPaymentMethod());

            // Process template
            String htmlContent = templateEngine.process("booking-success", context);

            // Construct rich email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(user.getEmail());
            helper.setSubject("Booking Confirmed: " + event.getName());
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            System.out.println("Booking success HTML email sent to " + user.getEmail());

        } catch (Exception e) {
            System.err.println("Failed to send HTML email: " + e.getMessage());
        }
    }

    public void sendNotification(String message){
        System.out.println("Sending notification to user...");
        System.out.println("MESSAGE: " + message);
        System.out.println("Notification sent successfully.");
    }
}