import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {deleteReview, getReviews} from "../api";

export default function ReviewList() {
    const [reviews, setReview] = useState([]);
    const [error, setError] = useState("");

    const load = () => getReviews().then(data => setReview(data)).catch(err => setError(err.message));
    useEffect(() => { load(); }, []);

    return (
        <div>
            {error && (
                <div className="error-popup">
                    <span>{error}</span>
                    <button onClick={() => setError("")}>X</button>
                </div>
            )}

            <h1>Reviews</h1>
            <Link to="/reviews/new">New review</Link>
            <table>
                <tbody>
                {reviews.map(r => (
                    <tr key={r.id}>
                        <td>
                            {r.id}. Customer '{r.customerId}' |
                            Room '{r.roomId}' |
                            {r.reviewText} |
                            {r.reviewDate}
                        </td>
                        <td><Link to={`/reviews/${r.id}/edit`}>Edit</Link></td>
                        <td><button onClick={() => deleteReview(r.id).then(load).catch(err => setError(err.message))}>Delete</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}