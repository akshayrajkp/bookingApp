package com.example.booking_service.dto;

import lombok.Data;

@Data
public class BookingRequestDTO {
    private Long userId;
    private Long eventId;
}