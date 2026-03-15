package com.example.event_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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

    @ElementCollection
    @CollectionTable(name = "event_available_seats",
            joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "seat_number")
    private List<String> availableSeats;

    private String imageUrl;
}