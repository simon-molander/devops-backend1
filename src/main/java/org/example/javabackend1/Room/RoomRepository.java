package org.example.javabackend1.Room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<RoomEntity, Long> {
    List<RoomEntity> findByRoomType(RoomType roomType);

    @Query("""
        SELECT room FROM RoomEntity room
        WHERE room NOT IN (
            SELECT booking.room FROM BookingEntity booking
            WHERE booking.checkInDate < :checkOut
            AND booking.checkOutDate > :checkIn
        )
        AND (
            (room.roomType = 'SINGLE' AND 1 >= :guests)
            OR
            (room.roomType = 'DOUBLE' AND (2 + room.extraBeds) >= :guests)
        )
        """)
    List<RoomEntity> findAvailableRooms(LocalDate checkIn, LocalDate checkOut, int guests);
}
