package com.example.booking_service.service;


import com.example.booking_service.dto.BookingRequestDTO;
import com.example.booking_service.dto.BookingResponseDTO;

import java.util.List;

public interface BookingService {

    BookingResponseDTO createBooking(BookingRequestDTO request);

    BookingResponseDTO cancelBooking(Long bookingId);

    List<BookingResponseDTO> getBookingsByUser(Long userId);
}