package com.example.event_service.controller;

import com.example.event_service.dto.EventRequestDTO;
import com.example.event_service.entity.Event;
import com.example.event_service.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // create event
    @PostMapping
    public Event createEvent(@RequestBody EventRequestDTO request) {
        return eventService.createEvent(request);
    }

    // get all events
    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    // get event by id
    @GetMapping("/{eventId}")
    public Event getEventById(@PathVariable Long eventId) {
        return eventService.getEventById(eventId);
    }

    // check if event has any available seats
    @GetMapping("/{eventId}/availability")
    public Boolean checkAvailability(@PathVariable Long eventId) {
        return eventService.checkAvailability(eventId);
    }

    // reserve a specific seat — called by booking-service via Feign
    @PostMapping("/{eventId}/reserve")
    public String reserveSeat(
            @PathVariable Long eventId,
            @RequestParam String seat
    ) {
        eventService.reserveSeat(eventId, seat);
        return "Seat " + seat + " reserved successfully";
    }

    // release a specific seat — called by booking-service on cancellation
    @PostMapping("/{eventId}/release")
    public String releaseSeat(
            @PathVariable Long eventId,
            @RequestParam String seat
    ) {
        eventService.releaseSeat(eventId, seat);
        return "Seat " + seat + " released successfully";
    }
}