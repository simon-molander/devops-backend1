package org.example.javabackend1.Booking;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookingCreateDTO {
    @NotNull
    private Long customerId;

    @NotNull
    private Long roomId;

    @NotNull
    private String checkInDate;

    @NotNull
    private String checkOutDate;

    @NotNull
    private int numberOfGuests;
}
