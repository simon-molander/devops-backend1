import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getReviews,
    createReview,
    updateReview,
    getCustomers,
    getRooms
} from "../api";

export default function ReviewForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [customerId, setCustomerId] = useState("");
    const [roomId, setRoomId] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [reviewDate, setReviewDate] = useState("");

    const [customers, setCustomers] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [error, setError] = useState("");

    useEffect(() => {
        getCustomers()
            .then(data => setCustomers(data))
            .catch(err => setError(err.message));

        getRooms()
            .then(data => setRooms(data))
            .catch(err => setError(err.message));

        if (isEditing) {
            getReviews()
                .then(reviews => {
                    const review = reviews.find(r => r.id === Number(id));

                    if (review) {
                        setCustomerId(String(review.customerId));
                        setRoomId(String(review.roomId));
                        setReviewText(review.reviewText);
                        setReviewDate(review.reviewDate);
                    }
                })
                .catch(err => setError(err.message));
        }
    }, [id, isEditing]);

    function handleSubmit(e) {
        e.preventDefault();

        const data = {
            customerId: Number(customerId),
            roomId: Number(roomId),
            reviewText,
            reviewDate
        };

        const save = isEditing
            ? updateReview(id, data)
            : createReview(data);

        save
            .then(() => navigate("/reviews"))
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

            <h1>{isEditing ? "Edit review" : "New review"}</h1>

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

                <textarea
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    placeholder="Review"
                    required
                />

                <input
                    type="date"
                    value={reviewDate}
                    onChange={e => setReviewDate(e.target.value)}
                    required
                />

                <button type="submit">Save</button>
            </form>
        </div>
    );
}