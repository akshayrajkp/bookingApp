package com.example.booking_service.controller;

import com.example.booking_service.dto.BookingRequestDTO;
import com.example.booking_service.dto.BookingResponseDTO;
import com.example.booking_service.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public BookingResponseDTO createBooking(@RequestBody BookingRequestDTO request) {
        return bookingService.createBooking(request);
    }

    @DeleteMapping("/{id}")
    public String cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return "Booking Cancelled";
    }
}