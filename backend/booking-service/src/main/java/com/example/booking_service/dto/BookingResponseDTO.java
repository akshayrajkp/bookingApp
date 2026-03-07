package com.example.booking_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponseDTO {
    private Long bookingId;
    private String status;
}