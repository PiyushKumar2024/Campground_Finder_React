/**
 * @file booking.js
 * @description Express routes for managing bookings and Stripe checkout sessions.
 */
import express from 'express';
import { isLoggedIn } from '../middlewares/middleware.js';
import { createBooking, getBookingsForCampground, cancelBooking, handleStripeWebhook, verifyCheckoutSession } from '../controllers/bookings.js';

const router = express.Router({ mergeParams: true });

// Stripe webhook — must use raw body (mounted separately in index.js)
// This route is here for reference; actual mounting happens in index.js
// router.post('/webhook/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

/**
 * @route GET /campgrounds/:id/bookings
 * @description Fetch active future bookings for a campground (used by calendar)
 */
router.get('/campgrounds/:id/bookings', getBookingsForCampground);

/**
 * @route POST /campgrounds/:id/bookings
 * @description Create a new booking and initialize a Stripe checkout session
 * @access Protected (Requires Login)
 */
router.post('/campgrounds/:id/bookings', isLoggedIn, createBooking);

/**
 * @route GET /bookings/verify/:sessionId
 * @description Verify a Stripe checkout session and update booking status
 * @access Protected (Requires Login)
 */
router.get('/bookings/verify/:sessionId', isLoggedIn, verifyCheckoutSession);

/**
 * @route DELETE /bookings/:bookingId
 * @description Cancel a booking and issue a Stripe refund
 * @access Protected (Requires Login)
 */
router.delete('/bookings/:bookingId', isLoggedIn, cancelBooking);

export default router;
