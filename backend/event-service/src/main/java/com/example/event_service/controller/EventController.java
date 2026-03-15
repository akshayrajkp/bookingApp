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
    public Event createEvent(@RequestBody EventRequestDTO request){
        return eventService.createEvent(request);
    }

    // list events
    @GetMapping
    public List<Event> getEvents(){
        return eventService.getAllEvents();
    }

    // check availability
    @GetMapping("/{eventId}/availability")
    public boolean checkAvailability(@PathVariable Long eventId){
        return eventService.checkAvailability(eventId);
    }

    // reserve seat
    @PostMapping("/{eventId}/reserve/{seatNumber}")
    public String reserveSeat(@PathVariable Long eventId,
                              @PathVariable String seatNumber){

        eventService.reserveSeat(eventId, seatNumber);

        return "Seat reserved successfully";
    }
}