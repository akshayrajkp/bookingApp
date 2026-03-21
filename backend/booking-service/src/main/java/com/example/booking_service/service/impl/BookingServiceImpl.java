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
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EventServiceClient eventServiceClient;
    private final WaitlistServiceClient waitlistServiceClient;
    private final BookingEventProducer bookingEventProducer;

    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO request) {

        // Null safety for seats
        List<String> seats = request.getSeats() != null ? request.getSeats() : Collections.emptyList();

        // 1. check availability
        Boolean available = eventServiceClient.checkAvailability(request.getEventId());

        // 2. IF NOT AVAILABLE → WAITLIST FLOW
        if (!available) {

            // call waitlist service
            waitlistServiceClient.joinWaitlist(
                    request.getEventId(),
                    request.getUserId()
            );

            System.out.println("Event full → User " + request.getUserId()
                    + " added to waitlist for event " + request.getEventId());

            // ✅ SAVE WAITLISTED BOOKING
            Booking booking = Booking.builder()
                    .userId(request.getUserId())
                    .eventId(request.getEventId())
                    .quantity(request.getQuantity())
                    .seats(seats)
                    .paymentMethod(request.getPaymentMethod())
                    .status("WAITLISTED")
                    .bookingTime(LocalDateTime.now())
                    .totalAmount(request.getTotalAmount())
                    .build();

            Booking saved = bookingRepository.save(booking);

            return mapToResponse(saved);
        }

        // 3. TRY SEAT RESERVATION
        try {
            for (String seat : seats) {
                eventServiceClient.reserveSeat(request.getEventId(), seat);
            }
        } catch (Exception e) {

            System.out.println("Seat reservation failed → " + e.getMessage()
                    + " → adding user " + request.getUserId() + " to waitlist");

            // add to waitlist
            waitlistServiceClient.joinWaitlist(
                    request.getEventId(),
                    request.getUserId()
            );

            // ✅ SAVE WAITLISTED BOOKING
            Booking booking = Booking.builder()
                    .userId(request.getUserId())
                    .eventId(request.getEventId())
                    .quantity(request.getQuantity())
                    .seats(seats)
                    .paymentMethod(request.getPaymentMethod())
                    .status("WAITLISTED")
                    .bookingTime(LocalDateTime.now())
                    .totalAmount(request.getTotalAmount())
                    .build();

            Booking saved = bookingRepository.save(booking);

            return mapToResponse(saved);
        }

        // 4. SUCCESS → CONFIRMED BOOKING
        Booking booking = Booking.builder()
                .userId(request.getUserId())
                .eventId(request.getEventId())
                .quantity(request.getQuantity())
                .seats(seats)
                .paymentMethod(request.getPaymentMethod())
                .status("CONFIRMED")
                .bookingTime(LocalDateTime.now())
                .totalAmount(request.getTotalAmount())
                .build();

        Booking saved = bookingRepository.save(booking);

        // 5. SEND KAFKA EVENT
        bookingEventProducer.sendBookingCreatedEvent(saved);

        System.out.println("Booking CONFIRMED → ID: " + saved.getId()
                + " | User: " + saved.getUserId()
                + " | Event: " + saved.getEventId()
                + " | Seats: " + saved.getSeats());

        return mapToResponse(saved);
    }

    @Override
    public BookingResponseDTO cancelBooking(Long bookingId) {

        // 1. find booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // 2. check status
        if ("CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("Booking already cancelled");
        }

        // 3. release seats ONLY if confirmed
        if ("CONFIRMED".equals(booking.getStatus())) {
            booking.getSeats().forEach(seat ->
                    eventServiceClient.releaseSeat(booking.getEventId(), seat)
            );
        }

        // 4. update status
        booking.setStatus("CANCELLED");
        Booking saved = bookingRepository.save(booking);

        // 5. Kafka → promote next user from waitlist
        bookingEventProducer.sendBookingCancelledEvent(saved.getEventId());

        System.out.println("Booking CANCELLED → ID: " + saved.getId()
                + " | Event: " + saved.getEventId());

        return mapToResponse(saved);
    }

    @Override
    public List<BookingResponseDTO> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // 🔥 COMMON MAPPER METHOD (clean code)
    private BookingResponseDTO mapToResponse(Booking booking) {
        return BookingResponseDTO.builder()
                .bookingId(booking.getId())
                .status(booking.getStatus())
                .eventId(booking.getEventId())
                .userId(booking.getUserId())
                .quantity(booking.getQuantity())
                .seats(booking.getSeats())
                .paymentMethod(booking.getPaymentMethod())
                .bookingTime(booking.getBookingTime().toString())
                .totalAmount(booking.getTotalAmount())
                .build();
    }
}