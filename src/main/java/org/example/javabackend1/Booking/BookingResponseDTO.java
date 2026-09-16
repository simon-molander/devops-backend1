package org.example.javabackend1.Booking;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookingResponseDTO {
    @NotNull
    private Long id;

    @NotNull
    private Long customerId;

    @NotNull
    private Long roomId;

    @NotNull
    private String roomType;

    @NotNull
    private int extraBeds;

    @NotNull
    private LocalDate checkInDate;

    @NotNull
    private LocalDate checkOutDate;

    @NotNull
    private int numberOfGuests;
}
