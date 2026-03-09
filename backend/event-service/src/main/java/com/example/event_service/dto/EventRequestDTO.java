package com.example.event_service.dto;

import lombok.Data;

@Data
public class EventRequestDTO {

    private String name;
    private int totalSeats;
}