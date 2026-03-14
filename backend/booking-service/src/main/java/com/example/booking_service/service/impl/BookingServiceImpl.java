package com.example.booking_service.service.impl;

import com.example.booking_service.client.EventServiceClient;
import com.example.booking_service.dto.BookingRequestDTO;
import com.example.booking_service.dto.BookingResponseDTO;
import com.example.booking_service.entity.Booking;
import com.example.booking_service.exception.CustomException;
import com.example.booking_service.kafka.producer.BookingEventProducer;
import com.example.booking_service.repository.BookingRepository;
import com.example.booking_service.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EventServiceClient eventServiceClient;
    private final BookingEventProducer bookingEventProducer;

    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO request) {

        Boolean available = eventServiceClient.checkAvailability(request.getEventId());

        if (!available) {
            throw new CustomException("Event is full. Added to waitlist.");
        }

        Booking booking = Booking.builder()
                .userId(request.getUserId())
                .eventId(request.getEventId())
                .status("CONFIRMED")
                .createdAt(LocalDateTime.now())
                .build();

        bookingRepository.save(booking);

        bookingEventProducer.sendBookingCreatedEvent(booking);

        return BookingResponseDTO.builder()
                .bookingId(booking.getId())
                .status("CONFIRMED")
                .build();
    }

    @Override
    public void cancelBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new CustomException("Booking not found"));

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);

        bookingEventProducer.sendBookingCancelledEvent(booking);
    }
}