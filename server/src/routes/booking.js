import express from 'express';
import { isLoggedIn } from '../middlewares/middleware.js';
import { createBooking, getBookingsForCampground, cancelBooking, handleStripeWebhook, verifyCheckoutSession } from '../controllers/bookings.js';

const router = express.Router({ mergeParams: true });

// Stripe webhook — must use raw body (mounted separately in index.js)
// This route is here for reference; actual mounting happens in index.js
// router.post('/webhook/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Get bookings for a campground (for calendar)
router.get('/campgrounds/:id/bookings', getBookingsForCampground);

// Create a booking (requires login) — now creates a Stripe Checkout Session
router.post('/campgrounds/:id/bookings', isLoggedIn, createBooking);

// Verify a checkout session (for the success page)
router.get('/bookings/verify/:sessionId', isLoggedIn, verifyCheckoutSession);

// Cancel a booking (requires login) — now issues a Stripe refund
router.delete('/bookings/:bookingId', isLoggedIn, cancelBooking);

export default router;
