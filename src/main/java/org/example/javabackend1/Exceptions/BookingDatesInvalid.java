package org.example.javabackend1.Exceptions;

public class BookingDatesInvalid extends RuntimeException {
    public BookingDatesInvalid(String message) {
        super(message);
    }
}
