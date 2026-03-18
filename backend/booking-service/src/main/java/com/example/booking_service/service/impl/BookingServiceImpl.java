package com.example.booking_service.service.impl;

import com.example.booking_service.client.EventServiceClient;
import com.example.booking_service.client.WaitlistServiceClient;
import com.example.booking_service.dto.BookingRequestDTO;
import com.example.booking_service.dto.BookingResponseDTO;
import com.example.booking_service.entity.Booking;
import com.example.booking_service.kafka.producer.BookingEventProducer;
import com.example.booking_service.repository.BookingRepository;
import com.example.booking_service.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository       bookingRepository;
    private final EventServiceClient      eventServiceClient;
    private final WaitlistServiceClient   waitlistServiceClient;
    private final BookingEventProducer    bookingEventProducer;

    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO request) {

        // 1. check if event has any available seats
        Boolean available = eventServiceClient.checkAvailability(request.getEventId());

        // 2. no seats available — add user to waitlist
        if (!available) {
            waitlistServiceClient.joinWaitlist(
                    request.getEventId(),
                    request.getUserId()
            );

            System.out.println("Event full. User " + request.getUserId()
                    + " added to waitlist for event " + request.getEventId());

            return BookingResponseDTO.builder()
                    .status("WAITLISTED")
                    .eventId(request.getEventId())
                    .userId(request.getUserId())
                    .build();
        }

        // 3. try to reserve each selected seat in event-service
        try {
            request.getSeats().forEach(seat ->
                    eventServiceClient.reserveSeat(request.getEventId(), seat)
            );
        } catch (Exception e) {
            // seat reservation failed mid-flow — add to waitlist
            System.out.println("Seat reservation failed: " + e.getMessage()
                    + " — adding user " + request.getUserId() + " to waitlist");

            waitlistServiceClient.joinWaitlist(
                    request.getEventId(),
                    request.getUserId()
            );

            return BookingResponseDTO.builder()
                    .status("WAITLISTED")
                    .eventId(request.getEventId())
                    .userId(request.getUserId())
                    .build();
        }

        // 4. all seats reserved — save confirmed booking
        Booking booking = Booking.builder()
                .userId(request.getUserId())
                .eventId(request.getEventId())
                .quantity(request.getQuantity())
                .seats(request.getSeats())
                .paymentMethod(request.getPaymentMethod())
                .status("CONFIRMED")
                .bookingTime(LocalDateTime.now())
                .totalAmount(request.getTotalAmount())
                .build();

        Booking saved = bookingRepository.save(booking);

        // 5. publish booking-created to Kafka
        // notification-service consumes this and sends confirmation email
        bookingEventProducer.sendBookingCreatedEvent(saved);

        System.out.println("Booking confirmed. ID: " + saved.getId()
                + " | User: " + saved.getUserId()
                + " | Event: " + saved.getEventId()
                + " | Seats: " + saved.getSeats());

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

    @Override
    public BookingResponseDTO cancelBooking(Long bookingId) {

        // 1. find booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // 2. check if already cancelled
        if ("CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("Booking already cancelled");
        }

        // 3. release each seat back to event-service
        booking.getSeats().forEach(seat ->
                eventServiceClient.releaseSeat(booking.getEventId(), seat)
        );

        // 4. update status to CANCELLED
        booking.setStatus("CANCELLED");
        Booking saved = bookingRepository.save(booking);

        // 5. publish booking-cancelled to Kafka
        // waitlist-service consumes this and promotes next user from Redis queue
        bookingEventProducer.sendBookingCancelledEvent(
                saved.getEventId().toString()
        );

        System.out.println("Booking cancelled. ID: " + saved.getId()
                + " | Event: " + saved.getEventId()
                + " | Seats released: " + saved.getSeats());

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

    @Override
    public List<BookingResponseDTO> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(b -> BookingResponseDTO.builder()
                        .bookingId(b.getId())
                        .status(b.getStatus())
                        .eventId(b.getEventId())
                        .userId(b.getUserId())
                        .quantity(b.getQuantity())
                        .seats(b.getSeats())
                        .paymentMethod(b.getPaymentMethod())
                        .bookingTime(b.getBookingTime() != null ? b.getBookingTime().toString() : null)
                        .totalAmount(b.getTotalAmount())
                        .build())
                .collect(Collectors.toList());
    }
}