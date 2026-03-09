package com.example.event_service.entity;

import jakarta.persistence.*;
import lombok.*;

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

    private int totalSeats;

    private int availableSeats;
}