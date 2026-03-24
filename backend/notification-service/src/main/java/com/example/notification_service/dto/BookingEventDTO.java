package com.example.notification_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class BookingEventDTO {
    private Long id;
    private Long userId;
    private Long eventId;
    private int quantity;
    private List<String> seats;
    private String paymentMethod;
    private String status;
    private Double totalAmount;
}
