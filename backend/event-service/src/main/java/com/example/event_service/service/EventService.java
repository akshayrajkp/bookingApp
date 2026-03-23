package com.example.event_service.service;

import com.example.event_service.dto.EventRequestDTO;
import com.example.event_service.entity.Event;
import com.example.event_service.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    // create event
    public Event createEvent(EventRequestDTO request) {

        Event event = Event.builder()
                .name(request.getName())
                .location(request.getLocation())
                .category(request.getCategory())
                .price(request.getPrice())
                .description(request.getDescription())
                .eventTime(request.getEventTime())
                .totalSeats(request.getTotalSeats())
                .availableSeats(new ArrayList<>(request.getAvailableSeats()))
                .images(request.getImages() != null
                        ? new ArrayList<>(request.getImages())
                        : new ArrayList<>())
                .build();

        return eventRepository.save(event);
    }

    // get all events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // get event by id
    public Event getEventById(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    // check seat availability
    @Transactional
    public boolean checkAvailability(Long eventId) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<String> seats = event.getAvailableSeats();

        System.out.println("checkAvailability - eventId: " + eventId
                + " | available seats count: " + seats.size());

        return !seats.isEmpty();
    }

    // reserve specific seat
    @Transactional
    public void reserveSeat(Long eventId, String seatNumber) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<String> seats = new ArrayList<>(event.getAvailableSeats());

        System.out.println("reserveSeat - eventId: " + eventId
                + " | seatNumber: " + seatNumber
                + " | availableSeats in DB: " + seats);

        // case-insensitive match to avoid "A1" vs "a1" mismatch
        String matchedSeat = seats.stream()
                .filter(s -> s.equalsIgnoreCase(seatNumber))
                .findFirst()
                .orElseThrow(() -> new RuntimeException(
                        "Seat " + seatNumber + " not available. Available: " + seats));

        seats.remove(matchedSeat);
        event.setAvailableSeats(seats);
        eventRepository.save(event);

        System.out.println("reserveSeat - seat " + matchedSeat
                + " reserved. Remaining seats: " + seats);
    }

    // release specific seat (called on booking cancellation)
    @Transactional
    public void releaseSeat(Long eventId, String seatNumber) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<String> seats = new ArrayList<>(event.getAvailableSeats());

        if (seats.contains(seatNumber)) {
            System.out.println("releaseSeat - seat " + seatNumber
                    + " already available, skipping");
            return;
        }

        seats.add(seatNumber);
        event.setAvailableSeats(seats);
        eventRepository.save(event);

        System.out.println("releaseSeat - seat " + seatNumber
                + " released. Available seats now: " + seats);
    }
}