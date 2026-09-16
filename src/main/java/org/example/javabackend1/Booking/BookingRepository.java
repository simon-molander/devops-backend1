package org.example.javabackend1.Booking;

import org.example.javabackend1.Room.RoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<BookingEntity, Long> {
    List<BookingEntity> findByRoomAndCheckInDateLessThanAndCheckOutDateGreaterThan(
            RoomEntity room,
            LocalDate checkOutDate,
            LocalDate checkInDate
    );
    boolean existsByCustomerIdAndCheckOutDateGreaterThanEqual(
            Long customerId,
            LocalDate today
    );
}
