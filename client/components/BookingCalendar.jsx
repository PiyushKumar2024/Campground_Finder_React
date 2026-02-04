import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import '../css/BookingCalendar.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BookingCalendar = ({ campgroundId, pricePerNight, currentUser }) => {
    const [selectedRange, setSelectedRange] = useState({ from: undefined, to: undefined });
    const [bookedDates, setBookedDates] = useState([]);
    const [userBookings, setUserBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Fetch booked dates for this campground
    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/campgrounds/${campgroundId}/bookings`);
                // Convert bookings to disabled date ranges
                const disabledRanges = res.data.map(booking => ({
                    from: new Date(booking.startDate),
                    to: new Date(booking.endDate)
                }));
                setBookedDates(disabledRanges);
            } catch (err) {
                console.error('Failed to fetch bookings:', err);
            }
        };
        fetchBookedDates();
    }, [campgroundId]);

    // Fetch user's bookings for this campground
    useEffect(() => {
        const fetchUserBookings = async () => {
            if (!currentUser) return;
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:3000/user/${currentUser.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Filter to only this campground's active bookings
                const myBookings = (res.data.bookings || []).filter(
                    b => b.campground?._id === campgroundId && b.status !== 'cancelled'
                );
                setUserBookings(myBookings);
            } catch (err) {
                console.error('Failed to fetch user bookings:', err);
            }
        };
        fetchUserBookings();
    }, [campgroundId, currentUser]);

    // Calculate nights and total price
    const calculateBooking = () => {
        if (!selectedRange || !selectedRange.from || !selectedRange.to) return null;
        const nights = Math.ceil((selectedRange.to - selectedRange.from) / (1000 * 60 * 60 * 24));
        const totalPrice = nights * pricePerNight;
        return { nights, totalPrice };
    };

    const bookingDetails = calculateBooking();

    // Handle booking submission
    const handleBooking = async () => {
        if (!selectedRange || !selectedRange.from || !selectedRange.to) return;

        setLoading(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:3000/campgrounds/${campgroundId}/bookings`,
                {
                    startDate: selectedRange.from.toISOString(),
                    endDate: selectedRange.to.toISOString()
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage({ type: 'success', text: 'Booking confirmed! Check your profile for details.' });
            setSelectedRange({ from: undefined, to: undefined });

            // Refresh booked dates and user bookings
            const res = await axios.get(`http://localhost:3000/campgrounds/${campgroundId}/bookings`);
            const disabledRanges = res.data.map(booking => ({
                from: new Date(booking.startDate),
                to: new Date(booking.endDate)
            }));
            setBookedDates(disabledRanges);

            // Refresh user bookings
            const userRes = await axios.get(`http://localhost:3000/user/${currentUser.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const myBookings = (userRes.data.bookings || []).filter(
                b => b.campground?._id === campgroundId && b.status !== 'cancelled'
            );
            setUserBookings(myBookings);
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to create booking'
            });
        } finally {
            setLoading(false);
        }
    };

    // Disable past dates and booked dates
    const disabledDays = [
        { before: new Date() },
        ...bookedDates
    ];

    return (
        <div className="booking-calendar-container">
            {/* User's Active Bookings Reminder */}
            {userBookings.length > 0 && (
                <div className="alert alert-info mb-3">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    <strong>You have {userBookings.length} booking{userBookings.length > 1 ? 's' : ''} here:</strong>
                    <ul className="mb-0 mt-2">
                        {userBookings.map(booking => (
                            <li key={booking._id}>
                                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <h4 className="fw-bold"><i className="bi bi-calendar-check me-2"></i>Book Your Stay</h4>

            <DayPicker
                mode="range"
                selected={selectedRange}
                onSelect={setSelectedRange}
                disabled={disabledDays}
                numberOfMonths={2}
                showOutsideDays
                fixedWeeks
            />

            {message && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} mt-3`}>
                    {message.text}
                </div>
            )}

            {bookingDetails && (
                <div className="booking-summary">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="nights">{bookingDetails.nights} night{bookingDetails.nights > 1 ? 's' : ''}</span>
                        <span className="total-price">${bookingDetails.totalPrice}</span>
                    </div>
                    <div className="price-breakdown">
                        ${pricePerNight} × {bookingDetails.nights} night{bookingDetails.nights > 1 ? 's' : ''}
                    </div>
                    <div className="text-muted small mt-2">
                        {selectedRange.from?.toLocaleDateString()} - {selectedRange.to?.toLocaleDateString()}
                    </div>
                </div>
            )}

            {currentUser ? (
                <button
                    className="btn btn-success btn-book-now"
                    onClick={handleBooking}
                    disabled={!bookingDetails || loading}
                >
                    {loading ? 'Booking...' : 'Book Now'}
                </button>
            ) : (
                <div className="login-prompt">
                    <Link to="/login">Log in</Link> to book this campground
                </div>
            )}
        </div>
    );
};

export default BookingCalendar;
