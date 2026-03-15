package com.example.event_service.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventRequestDTO {

    private String name;
    private String location;
    private String category;
    private double price;
    private String description;
    private LocalDateTime eventTime;
    private int totalSeats;
    private String imageUrl;
}