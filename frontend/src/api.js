const BASE = "/api";

async function request(url, options = {}) {
    const res = await fetch(url, options);

    const text = await res.text();

    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!res.ok) {
        throw new Error(
            data?.message ||
            data?.error ||
            data ||
            "Something went wrong"
        );
    }

    return data;
}

// REVIEWS

export async function getReviews() {
    return request(`${BASE}/reviews`);
}

export async function createReview(data) {
    return request(`${BASE}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export async function updateReview(id, data) {
    return request(`${BASE}/reviews/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export async function deleteReview(id) {
    return request(`${BASE}/reviews/${id}`, {
        method: "DELETE",
    });
}

// CUSTOMERS

export async function getCustomers() {
    return request(`${BASE}/customers`);
}

export async function createCustomer(data) {
    return request(`${BASE}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export async function updateCustomer(id, data) {
    return request(`${BASE}/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export async function deleteCustomer(id) {
    return request(`${BASE}/customers/${id}`, {
        method: "DELETE",
    });
}

// ROOMS

export async function getRooms() {
    return request(`${BASE}/rooms`);
}

export async function createRoom(data) {
    return request(`${BASE}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export async function updateRoom(data, id) {
    return request(`${BASE}/rooms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export async function deleteRoom(id) {
    return request(`${BASE}/rooms/${id}`, {
        method: "DELETE",
    });
}

// BOOKINGS

export async function getBookings() {
    return request(`${BASE}/bookings`);
}

export async function createBooking(data) {
    return request(`${BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export async function updateBooking(data, id) {
    return request(`${BASE}/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export async function deleteBooking(id) {
    return request(`${BASE}/bookings/${id}`, {
        method: "DELETE",
    });
}