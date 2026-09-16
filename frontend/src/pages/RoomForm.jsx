import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRooms, createRoom, updateRoom } from "../api";

const ROOM_TYPES = ["SINGLE", "DOUBLE"]; // adjust to match your RoomType enum values

export default function RoomForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [roomType, setRoomType] = useState(ROOM_TYPES[0]);
    const [extraBeds, setExtraBeds] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isEditing) {
            getRooms().then(rooms => {
                const room = rooms.find(r => r.id === Number(id));
                if (room) {
                    setRoomType(room.roomType);
                    setExtraBeds(room.extraBeds);
                }
            });
        }
    }, [id, isEditing]);

    function handleSubmit(e) {
        e.preventDefault();
        const data = { roomType, extraBeds: Number(extraBeds) };
        const save = isEditing ? updateRoom(id, data) : createRoom(data);
        save.then(() => navigate("/rooms")).catch(err => setError(err.message));
    }

    return (
        <div>
            {error && (
                <div className="error-popup">
                    <span>{error}</span>
                    <button onClick={() => setError("")}>X</button>
                </div>
            )}
            <h1>{isEditing ? "Edit room" : "New room"}</h1>
            <form onSubmit={handleSubmit}>
                <select value={roomType} onChange={e => setRoomType(e.target.value)}>
                    {ROOM_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <input
                    type="number"
                    min="0"
                    value={extraBeds}
                    onChange={e => setExtraBeds(e.target.value)}
                    placeholder="Extra beds"
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
}