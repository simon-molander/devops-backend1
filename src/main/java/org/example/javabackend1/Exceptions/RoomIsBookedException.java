package org.example.javabackend1.Exceptions;

public class RoomIsBookedException extends RuntimeException {
    public RoomIsBookedException(String message) {
        super(message);
    }
}
