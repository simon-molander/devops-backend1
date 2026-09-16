package org.example.javabackend1.Exceptions;

public class InvalidRoomDataException extends RuntimeException {
    public InvalidRoomDataException(String message) {
        super(message);
    }
}
