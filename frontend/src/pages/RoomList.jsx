import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRooms, deleteRoom } from "../api";

export default function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState("");

    const load = () => getRooms().then(data => setRooms(data)).catch(err => setError(err.message));
    useEffect(() => { load(); }, []);

    return (
        <div>
            {error && (
                <div className="error-popup">
                    <span>{error}</span>
                    <button onClick={() => setError("")}>X</button>
                </div>
            )}

            <h1>Rooms</h1>
            <Link to="/rooms/new">New room</Link>
            <table>
                <tbody>
                {rooms.map(r => (
                    <tr key={r.id}>
                        <td>Room ({r.id}) | {r.roomType}</td>
                        <td><Link to={`/rooms/${r.id}/edit`}>Edit</Link></td>
                        <td><button onClick={() => deleteRoom(r.id).then(load).catch(err => setError(err.message))}>Delete</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}