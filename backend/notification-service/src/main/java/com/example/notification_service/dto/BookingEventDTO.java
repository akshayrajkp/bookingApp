package com.example.notification_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingEventDTO {
    private Long id;
    private Long userId;
    private Long eventId;
    private int quantity;
    private List<String> seats;
    private String paymentMethod;
    private String status;
    private String bookingTime;
    private Double totalAmount;
}
