import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookings, createBooking, updateBooking } from "../api";
import { getCustomers, getRooms } from "../api";

export default function BookingForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [customerId, setCustomerId] = useState("");
    const [roomId, setRoomId] = useState("");
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [numberOfGuests, setNumberOfGuests] = useState(1);

    const [customers, setCustomers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        getCustomers().then(setCustomers);
        getRooms().then(setRooms);
    }, []);

    useEffect(() => {
        if (isEditing) {
            getBookings().then(bookings => {
                console.log(bookings);

                const booking = bookings.find(b => b.id === Number(id));

                if (booking) {
                    setCustomerId(booking.customerId ?? "");
                    setRoomId(booking.roomId ?? "");
                    setCheckInDate(booking.checkInDate ?? "");
                    setCheckOutDate(booking.checkOutDate ?? "");
                    setNumberOfGuests(booking.numberOfGuests ?? 1);
                }
            });
        }
    }, [id, isEditing]);

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const data = {
            customerId: Number(customerId),
            roomId: Number(roomId),
            checkInDate,
            checkOutDate,
            numberOfGuests: Number(numberOfGuests),
        };

        console.log(data);

        const save = isEditing
            ? updateBooking(data, id)
            : createBooking(data);

        save
            .then(() => navigate("/bookings"))
            .catch(err => setError(err.message));
    }

    return (
        <div>
            {error && (
                <div className="error-popup">
                    <span>{error}</span>
                    <button onClick={() => setError("")}>X</button>
                </div>
            )}

            <h1>{isEditing ? "Edit booking" : "New booking"}</h1>

            <form onSubmit={handleSubmit}>
                <select
                    value={customerId}
                    onChange={e => setCustomerId(e.target.value)}
                    required
                >
                    <option value="" disabled>
                        Select customer
                    </option>

                    {customers.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.firstName} {c.lastName}
                        </option>
                    ))}
                </select>

                <select
                    value={roomId}
                    onChange={e => setRoomId(e.target.value)}
                    required
                >
                    <option value="" disabled>
                        Select room
                    </option>

                    {rooms.map(r => (
                        <option key={r.id} value={r.id}>
                            {r.roomType} (Room {r.id})
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={checkInDate}
                    onChange={e => setCheckInDate(e.target.value)}
                    required
                />

                <input
                    type="date"
                    value={checkOutDate}
                    onChange={e => setCheckOutDate(e.target.value)}
                    required
                />

                <input
                    type="number"
                    min="1"
                    value={numberOfGuests}
                    onChange={e => setNumberOfGuests(e.target.value)}
                    required
                />

                <button type="submit">Save</button>
            </form>
        </div>
    );
}