package org.example.javabackend1.Exceptions;

public class RoomDatesInvalidException extends RuntimeException {
    public RoomDatesInvalidException(String message) {
        super(message);
    }
}
