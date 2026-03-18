package com.example.booking_service.controller;

import com.example.booking_service.dto.BookingRequestDTO;
import com.example.booking_service.dto.BookingResponseDTO;
import com.example.booking_service.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public BookingResponseDTO bookTicket(@RequestBody BookingRequestDTO request){
        return bookingService.createBooking(request);
    }

    @DeleteMapping("/{bookingId}")
    public BookingResponseDTO cancelBooking(@PathVariable Long bookingId){
        return bookingService.cancelBooking(bookingId);
    }

    @GetMapping("/user/{userId}")
    public List<BookingResponseDTO> getMyBookings(@PathVariable Long userId){
        return bookingService.getBookingsByUser(userId);
    }
}