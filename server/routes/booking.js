import express from 'express';
import { isLoggedIn } from '../middlewares/middleware.js';
import { createBooking, getBookingsForCampground, cancelBooking } from '../controllers/bookings.js';

const router = express.Router({ mergeParams: true });

// Get bookings for a campground (for calendar)
router.get('/campgrounds/:id/bookings', getBookingsForCampground);

// Create a booking (requires login)
router.post('/campgrounds/:id/bookings', isLoggedIn, createBooking);

// Cancel a booking (requires login)
router.delete('/bookings/:bookingId', isLoggedIn, cancelBooking);

export default router;
