package com.example.booking_service.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookingRequestDTO {
    private Long userId;
    private Long eventId;
    private int quantity;
    private List<String> seats;
    private String paymentMethod;  // "card" or "upi"
    private double totalAmount;
}