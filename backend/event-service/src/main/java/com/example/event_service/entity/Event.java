package com.example.event_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
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

    // EAGER ensures seats are loaded immediately with the event
    // without this, getAvailableSeats() returns empty list outside a transaction
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "event_available_seats",
            joinColumns = @JoinColumn(name = "event_id")
    )
    @Column(name = "seat_number")
    @Builder.Default
    private List<String> availableSeats = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "event_images",
            joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();
}