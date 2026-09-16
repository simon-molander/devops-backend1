import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomers, createCustomer, updateCustomer } from "../api";

export default function CustomerForm() {
    const { id } = useParams();       // undefined on "/customers/new", a string on "/customers/:id/edit"
    const navigate = useNavigate();   // lets us redirect after saving
    const isEditing = Boolean(id);    // true if there's an id in the URL

    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [error, setError] = useState("");

    // If we're editing, load the existing customer and fill the form
    useEffect(() => {
        if (isEditing) {
            getCustomers().then(customers => {
                const customer = customers.find(c => c.id === Number(id));
                if (customer) {
                    setFirstName(customer.firstName);
                    setLastName(customer.lastName);
                    setEmail(customer.email);
                    setPhone(customer.phone);
                }
            });
        }
    }, [id, isEditing]);

    function handleSubmit(e) {
        e.preventDefault(); // stop the browser from doing a full page reload on submit
        const data = { firstName, lastName, email, phone };

        const save = isEditing ? updateCustomer(id, data) : createCustomer(data);

        save.then(() => navigate("/customers")).catch(err => setError(err.message));
    }

    return (
        <div>
            {error && (
                <div className="error-popup">
                    <span>{error}</span>
                    <button onClick={() => setError("")}>X</button>
                </div>
            )}
            <h1>{isEditing ? "Edit customer" : "New customer"}</h1>
            <form onSubmit={handleSubmit}>
                <input
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="First name"
                />
                <input
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Last name"
                />
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Phone"
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
}