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

    // create event
    public Event createEvent(EventRequestDTO request){

        Event event = Event.builder()
                .name(request.getName())
                .location(request.getLocation())
                .category(request.getCategory())
                .price(request.getPrice())
                .description(request.getDescription())
                .eventTime(request.getEventTime())
                .totalSeats(request.getTotalSeats())
                .availableSeats(request.getAvailableSeats())
                .imageUrl(request.getImageUrl())
                .build();

        return eventRepository.save(event);
    }

    // get all events
    public List<Event> getAllEvents(){
        return eventRepository.findAll();
    }

    // check seat availability
    public boolean checkAvailability(Long eventId){

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        return !event.getAvailableSeats().isEmpty();
    }

    // reserve specific seat
    public void reserveSeat(Long eventId, String seatNumber){

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<String> seats = event.getAvailableSeats();

        if(!seats.contains(seatNumber)){
            throw new RuntimeException("Seat not available");
        }

        seats.remove(seatNumber);

        event.setAvailableSeats(seats);

        eventRepository.save(event);
    }
}