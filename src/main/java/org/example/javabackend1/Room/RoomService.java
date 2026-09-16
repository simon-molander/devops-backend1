package org.example.javabackend1.Room;

import org.example.javabackend1.Exceptions.InvalidRoomDataException;
import org.example.javabackend1.Exceptions.RoomDatesInvalidException;
import org.example.javabackend1.Exceptions.RoomNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class RoomService {
    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<RoomResponseDTO> findAvailableRooms(String checkInDate, String checkOutDate, int guests) {
        LocalDate checkIn = LocalDate.parse(checkInDate);
        LocalDate checkOut = LocalDate.parse(checkOutDate);

        if (checkOut.isBefore(checkIn) || checkOut.isEqual(checkIn)) {
            throw new RoomDatesInvalidException("Check out must be after check in");
        }

        List<RoomResponseDTO> responseRooms = new ArrayList<>();

        for (RoomEntity room : roomRepository.findAvailableRooms(checkIn, checkOut, guests)) {
            responseRooms.add(toDTO(room));
        }

        return responseRooms;
    }

    public List<RoomResponseDTO> findAll() {
        return roomRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public RoomResponseDTO findById(Long roomId) {
        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Could not find the room with id " + roomId));

        return toDTO(room);
    }

    public RoomResponseDTO create(RoomCreateDTO dto) {
        if (dto.getRoomType() == RoomType.SINGLE && dto.getExtraBeds() > 0) {
            throw new InvalidRoomDataException("Single rooms cant have extra beds");
        }
        RoomEntity saved = roomRepository.save(toEntity(dto));
        return toDTO(saved);
    }

    public RoomResponseDTO update(Long roomId, RoomCreateDTO dto) {
        if (dto.getRoomType() == RoomType.SINGLE && dto.getExtraBeds() > 0) {
            throw new InvalidRoomDataException("Single rooms cant have extra beds");
        }

        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room was not found"));
        room.setRoomType(dto.getRoomType());
        room.setExtraBeds(dto.getExtraBeds());

        RoomEntity saved = roomRepository.save(room);
        return toDTO(saved);
    }

    public void delete(Long roomId) {
        roomRepository.deleteById(roomId);
    }

    private RoomResponseDTO toDTO(RoomEntity room) {
        RoomResponseDTO dto = new RoomResponseDTO();
        dto.setId(room.getId());
        dto.setRoomType(room.getRoomType());
        dto.setExtraBeds(room.getExtraBeds());
        dto.setMaxCapacity(room.getMaxCapacity());
        return dto;
    }

    private RoomCreateDTO toCreateDTO(RoomEntity room) {
        RoomCreateDTO dto = new RoomCreateDTO();
        dto.setRoomType(room.getRoomType());
        dto.setExtraBeds(room.getExtraBeds());
        return dto;
    }

    private RoomEntity toEntity(RoomCreateDTO dto) {
        RoomEntity room = new RoomEntity();
        room.setRoomType(dto.getRoomType());
        room.setExtraBeds(dto.getExtraBeds());
        return room;
    }

    public int getMaxCapacity(RoomResponseDTO room) {

        if (room.getRoomType() == RoomType.SINGLE) {
            return 1;
        }

        return 2 + room.getExtraBeds();
    }
}
