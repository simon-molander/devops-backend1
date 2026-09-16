export default function ErrorPopup({ message, onClose }) {
    if (!message) {
        return null;
    }

    return (
        <div className="error-popup">
            <span>{message}</span>
            <button onClick={onClose}>X</button>
        </div>
    );
}