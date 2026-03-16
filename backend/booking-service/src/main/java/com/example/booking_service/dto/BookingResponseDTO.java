package com.example.booking_service.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class BookingResponseDTO {
    private Long bookingId;
    private String status;
    private Long eventId;
    private Long userId;
    private int quantity;       //seats.size()
    private List<String> seats;
    private String paymentMethod;
    private String bookingTime;    // when it was booked
    private double totalAmount;    // final amount charged
}