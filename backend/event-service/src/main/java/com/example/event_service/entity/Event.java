package com.example.event_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String location;

    private String category;

    private double price;

    @Column(length = 2000)
    private String description;

    private LocalDateTime eventTime;

    private int totalSeats;

    private int availableSeats;

    private String imageUrl;
}