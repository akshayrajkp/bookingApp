package com.example.event_service.service;

import com.example.event_service.dto.EventRequestDTO;
import com.example.event_service.entity.Event;
import com.example.event_service.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public Event createEvent(EventRequestDTO request){

        Event event = Event.builder()
                .name(request.getName())
                .location(request.getLocation())
                .category(request.getCategory())
                .price(request.getPrice())
                .description(request.getDescription())
                .eventTime(request.getEventTime())
                .totalSeats(request.getTotalSeats())
                .availableSeats(request.getTotalSeats())
                .imageUrl(request.getImageUrl())
                .build();

        return eventRepository.save(event);
    }

    public List<Event> getAllEvents(){
        return eventRepository.findAll();
    }

    public boolean checkAvailability(Long eventId){

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        return event.getAvailableSeats() > 0;
    }

    public void reserveSeat(Long eventId){

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if(event.getAvailableSeats() <= 0){
            throw new RuntimeException("Event is fully booked");
        }

        event.setAvailableSeats(event.getAvailableSeats() - 1);

        eventRepository.save(event);
    }
}