package com.example.booking_service.service.impl;

import com.example.booking_service.client.EventServiceClient;
import com.example.booking_service.dto.BookingRequestDTO;
import com.example.booking_service.dto.BookingResponseDTO;
import com.example.booking_service.entity.Booking;
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

    public BookingResponseDTO createBooking(BookingRequestDTO request){

        // reserve seats from event-service
        request.getSeats().forEach(seat ->
                eventServiceClient.reserveSeat(request.getEventId(), seat)
        );

        double seatPrice = 1000; // normally fetched from event-service
        double totalAmount = seatPrice * request.getQuantity();

        Booking booking = Booking.builder()
                .userId(request.getUserId())
                .eventId(request.getEventId())
                .quantity(request.getQuantity())
                .paymentMethod(request.getPaymentMethod())
                .status("CONFIRMED")
                .bookingTime(LocalDateTime.now())
                .totalAmount(totalAmount)
                .seats(request.getSeats())
                .build();

        Booking saved = bookingRepository.save(booking);

        return BookingResponseDTO.builder()
                .bookingId(saved.getId())
                .status(saved.getStatus())
                .eventId(saved.getEventId())
                .userId(saved.getUserId())
                .quantity(saved.getQuantity())
                .seats(saved.getSeats())
                .paymentMethod(saved.getPaymentMethod())
                .bookingTime(saved.getBookingTime().toString())
                .totalAmount(saved.getTotalAmount())
                .build();
    }

    public BookingResponseDTO cancelBooking(Long bookingId){

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if("CANCELLED".equals(booking.getStatus())){
            throw new RuntimeException("Booking already cancelled");
        }

        // release seats back to event service
        booking.getSeats().forEach(seat ->
                eventServiceClient.releaseSeat(booking.getEventId(), seat)
        );

        booking.setStatus("CANCELLED");

        Booking saved = bookingRepository.save(booking);

        return BookingResponseDTO.builder()
                .bookingId(saved.getId())
                .status(saved.getStatus())
                .eventId(saved.getEventId())
                .userId(saved.getUserId())
                .quantity(saved.getQuantity())
                .seats(saved.getSeats())
                .paymentMethod(saved.getPaymentMethod())
                .bookingTime(saved.getBookingTime().toString())
                .totalAmount(saved.getTotalAmount())
                .build();
    }
}