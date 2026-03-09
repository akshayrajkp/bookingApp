package com.example.event_service.service;

import com.example.event_service.dto.EventRequestDTO;
import com.example.event_service.entity.Event;
import com.example.event_service.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public Event createEvent(EventRequestDTO request) {

        Event event = Event.builder()
                .name(request.getName())
                .totalSeats(request.getTotalSeats())
                .availableSeats(request.getTotalSeats())
                .build();

        return eventRepository.save(event);
    }

    public boolean checkAvailability(Long eventId) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        return event.getAvailableSeats() > 0;
    }

    public void decreaseSeat(Long eventId) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if(event.getAvailableSeats() <= 0){
            throw new RuntimeException("No seats available");
        }

        event.setAvailableSeats(event.getAvailableSeats() - 1);

        eventRepository.save(event);
    }
}