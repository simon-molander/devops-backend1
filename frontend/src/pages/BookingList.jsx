import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {deleteBooking, getBookings} from "../api";

export default function BookingList() {
    const [bookings, setBooking] = useState([]);
    const [error, setError] = useState("");

    const load = () => getBookings().then(data => setBooking(data)).catch(err => setError(err.message));
    useEffect(() => { load(); }, []);

    return (
        <div>
            {error && (
                <div className="error-popup">
                    <span>{error}</span>
                    <button onClick={() => setError("")}>X</button>
                </div>
            )}

            <h1>Bookings</h1>
            <Link to="/bookings/new">New booking</Link>
            <table>
                <tbody>
                {bookings.map(b => (
                    <tr key={b.id}>
                        <td>{b.id}. Customer '{b.customerId}' | {b.numberOfGuests} Guest(s) | From {b.checkInDate} To {b.checkOutDate}</td>
                        <td><Link to={`/bookings/${b.id}/edit`}>Edit</Link></td>
                        <td><button onClick={() => deleteBooking(b.id).then(load).catch(err => setError(err.message))}>Delete</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}