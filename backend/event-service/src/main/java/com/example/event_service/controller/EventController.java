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

    @PostMapping
    public Event createEvent(@RequestBody EventRequestDTO request){
        return eventService.createEvent(request);
    }

    @GetMapping
    public List<Event> getAllEvents(){
        return eventService.getAllEvents();
    }

    @GetMapping("/{eventId}/availability")
    public Boolean checkAvailability(@PathVariable Long eventId){
        return eventService.checkAvailability(eventId);
    }

    @PostMapping("/{eventId}/reserve")
    public String reserveSeat(@PathVariable Long eventId){

        eventService.reserveSeat(eventId);

        return "Seat reserved";
    }
}