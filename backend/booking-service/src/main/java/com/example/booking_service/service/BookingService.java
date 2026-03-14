package com.example.booking_service.service;


import com.example.booking_service.dto.BookingRequestDTO;
import com.example.booking_service.dto.BookingResponseDTO;

public interface BookingService {

    BookingResponseDTO createBooking(BookingRequestDTO request);

    void cancelBooking(Long bookingId);
}