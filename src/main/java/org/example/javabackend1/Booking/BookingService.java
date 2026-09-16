package org.example.javabackend1.Booking;

import org.example.javabackend1.CustomerServiceClient;
import org.example.javabackend1.Exceptions.*;
import org.example.javabackend1.Room.RoomEntity;
import org.example.javabackend1.Room.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final CustomerServiceClient customerServiceClient;

    public BookingService(BookingRepository bookingRepository,
                          RoomRepository roomRepository,
                          CustomerServiceClient customerServiceClient) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.customerServiceClient = customerServiceClient;
    }

    private BookingEntity getBookingById(long id) {
        return bookingRepository.findById(id)
            .orElseThrow(() -> new BookingNotFoundException("Booking with id " + id + " does not exist"));
    }

    private RoomEntity getRoomById(long id) {
        return roomRepository.findById(id)
            .orElseThrow(() -> new RoomNotFoundException("Room with id " + id + " does not exist"));
    }

    private BookingResponseDTO createBookingResponseDTO(
            BookingCreateDTO createDTO,
            BookingEntity booking,
            RoomEntity roomEntity
    ) {
        LocalDate checkInDate = LocalDate.parse(createDTO.getCheckInDate());
        LocalDate checkOutDate = LocalDate.parse(createDTO.getCheckOutDate());

        if (!checkOutDate.isAfter(checkInDate)) {
            throw new BookingDatesInvalid("Check out must be after check in");
        }

        checkIfRoomIsAvailable(
                roomEntity,
                checkInDate,
                checkOutDate,
                booking.getId()
        );

        booking.setCheckInDate(checkInDate);
        booking.setCheckOutDate(checkOutDate);
        booking.setNumberOfGuests(createDTO.getNumberOfGuests());
        booking.setRoom(roomEntity);
        booking.setCustomerId(createDTO.getCustomerId());

        BookingEntity saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    public BookingResponseDTO create(BookingCreateDTO createDTO) {
        try {
            if (!customerServiceClient.customerExists(createDTO.getCustomerId())) {
                throw new CustomerNotFoundException("Customer with id " + createDTO.getCustomerId() + " was not found");
            }
        } catch (HttpServerErrorException | ResourceAccessException exception) {
            throw new CustomerServiceUnavailableException("The customer service is unavailable. Try again later.");
        }

        RoomEntity room = getRoomById(createDTO.getRoomId());

        return createBookingResponseDTO(createDTO, new BookingEntity(), room);
    }

    public BookingResponseDTO update(Long id, BookingCreateDTO createDTO) {
        RoomEntity room = getRoomById(createDTO.getRoomId());
        BookingEntity booking = getBookingById(id);

        return createBookingResponseDTO(createDTO, booking, room);
    }

    public void delete(Long id) {
        BookingEntity booking = getBookingById(id);

        bookingRepository.delete(booking);
    }

    public BookingResponseDTO findById(Long id) {
        BookingEntity booking = getBookingById(id);

        return toResponse(booking);
    }

    public List<BookingResponseDTO> findAll() {
        List<BookingEntity> bookings = bookingRepository.findAll();

        List<BookingResponseDTO> responseBookings = new ArrayList<>();
        for (BookingEntity booking : bookings) {
            responseBookings.add(toResponse(booking));
        }

        return responseBookings;
    }

    public BookingResponseDTO toResponse(BookingEntity booking) {
        BookingResponseDTO response = new BookingResponseDTO();
        response.setId(booking.getId());
        response.setRoomId(booking.getRoom().getId());
        response.setRoomType(booking.getRoom().getRoomType().toString());
        response.setExtraBeds(booking.getRoom().getExtraBeds());
        response.setCheckInDate(booking.getCheckInDate());
        response.setCheckOutDate(booking.getCheckOutDate());
        response.setNumberOfGuests(booking.getNumberOfGuests());
        response.setCustomerId(booking.getCustomerId());
        return response;
    }

    private void checkIfRoomIsAvailable(
            RoomEntity room,
            LocalDate checkInDate,
            LocalDate checkOutDate,
            Long bookingIdToIgnore
    ) {
        List<BookingEntity> overlappingBookings = bookingRepository.findByRoomAndCheckInDateLessThanAndCheckOutDateGreaterThan(
                room,
                checkOutDate,
                checkInDate
        );

        for (BookingEntity existingBooking : overlappingBookings) {
            if (bookingIdToIgnore == null ||
                    !existingBooking.getId().equals(bookingIdToIgnore)) {
                throw new RoomIsBookedException("A room is already booked for these dates");
            }
        }
    }

    public boolean customerHasActiveBooking(Long id) {
        return bookingRepository.existsByCustomerIdAndCheckOutDateGreaterThanEqual(id, LocalDate.now());
    }
}