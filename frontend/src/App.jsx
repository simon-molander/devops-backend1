import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CustomerList from "./pages/CustomerList";
import CustomerForm from "./pages/CustomerForm";
import './App.css'
import BookingList from "./pages/BookingList.jsx";
import BookingForm from "./pages/BookingForm.jsx";
import RoomForm from "./pages/RoomForm.jsx";
import RoomList from "./pages/RoomList.jsx";
import ReviewList from "./pages/ReviewList.jsx";
import ReviewForm from "./pages/ReviewForm.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
      <BrowserRouter>
        <nav>
          <Link to="/customers">Customers</Link>
          <Link to="/rooms">Rooms</Link>
          <Link to="/bookings">Bookings</Link>
          <Link to="/reviews">Reviews</Link>
        </nav>

        <Routes>
          <Route path="/customers" element={<CustomerList/>}/>
          <Route path="/customers/new" element={<CustomerForm/>}/>
          <Route path="/customers/:id/edit" element={<CustomerForm/>}/>

          <Route path="/rooms" element={<RoomList/>} />
          <Route path="/rooms/new" element={<RoomForm/>}/>
          <Route path="/rooms/:id/edit" element={<RoomForm/>}/>

          <Route path="/bookings" element={<BookingList/>}/>
          <Route path="/bookings/new" element={<BookingForm/>}/>
          <Route path="/bookings/:id/edit" element={<BookingForm/>}/>

          <Route path="/reviews" element={<ReviewList/>}/>
          <Route path="/reviews/new" element={<ReviewForm/>}/>
          <Route path="/reviews/:id/edit" element={<ReviewForm/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App
