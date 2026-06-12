/**
 * @file bookings.js
 * @description Controllers for managing campground reservations and processing payments via Stripe.
 */
import catchAsync from '../helper/catchAsync.js';
import Booking from '../models/booking.js';
import Campground from '../models/campground.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a new pending booking and initialize a Stripe Checkout Session
 * @route POST /campgrounds/:id/book
 * @body {string} startDate - The check-in date
 * @body {string} endDate - The check-out date
 */
export const createBooking = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
        return res.status(400).json({ message: 'Start date cannot be in the past' });
    }
    if (end <= start) {
        return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Get campground to calculate price
    const campground = await Campground.findById(id);
    if (!campground) {
        return res.status(404).json({ message: 'Campground not found' });
    }

    // Check for overlapping bookings (exclude pending bookings older than 30 min)
    const overlapping = await Booking.findOne({
        campground: id,
        status: { $in: ['paid', 'confirmed', 'completed'] },
        $or: [
            { startDate: { $lt: end }, endDate: { $gt: start } }
        ]
    });

    if (overlapping) {
        return res.status(400).json({ message: 'These dates are already booked' });
    }

    // Calculate total price (number of nights × price per night)
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * campground.price;

    // Create booking with pending status
    const booking = new Booking({
        startDate: start,
        endDate: end,
        campground: id,
        user: req.user._id,
        totalPrice,
        status: 'pending'
    });

    await booking.save();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: campground.name,
                        description: `${nights} night${nights > 1 ? 's' : ''} at ${campground.location}`,
                        images: campground.image.length > 0 ? [campground.image[0].url] : [],
                    },
                    unit_amount: Math.round(totalPrice * 100), // Stripe expects cents
                },
                quantity: 1,
            },
        ],
        metadata: {
            bookingId: booking._id.toString(),
            campgroundId: id,
            userId: req.user._id.toString(),
        },
        success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/booking/cancel?session_id={CHECKOUT_SESSION_ID}`,
        expires_at: Math.floor(Date.now() / 1000) + 1800, // Session expires in 30 minutes
    });

    // Save session ID on the booking
    booking.stripeSessionId = session.id;
    await booking.save();

    res.status(201).json({
        message: 'Booking created, proceed to payment',
        sessionUrl: session.url,
        booking: {
            _id: booking._id,
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalPrice: booking.totalPrice,
            nights,
            status: booking.status
        }
    });
});

/**
 * Stripe Webhook Handler
 * Processes async payment confirmations and expirations from Stripe
 * @route POST /webhook/stripe
 */
export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // If webhook secret is configured, verify the signature
        if (process.env.STRIPE_WEBHOOK_SECRET) {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } else {
            // For development without webhook secret, parse the body directly
            event = JSON.parse(req.body.toString());
        }
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const bookingId = session.metadata.bookingId;

        try {
            const booking = await Booking.findById(bookingId);
            if (booking && booking.status === 'pending') {
                booking.status = 'paid';
                booking.paymentIntentId = session.payment_intent;
                await booking.save();
                console.log(`Booking ${bookingId} marked as paid`);
            }
        } catch (err) {
            console.error('Error updating booking after payment:', err);
        }
    }

    // Handle session expiration — cancel pending bookings
    if (event.type === 'checkout.session.expired') {
        const session = event.data.object;
        const bookingId = session.metadata.bookingId;

        try {
            const booking = await Booking.findById(bookingId);
            if (booking && booking.status === 'pending') {
                booking.status = 'cancelled';
                await booking.save();
                console.log(`Booking ${bookingId} cancelled (session expired)`);
            }
        } catch (err) {
            console.error('Error cancelling expired booking:', err);
        }
    }

    res.json({ received: true });
};

/**
 * Verify a checkout session and update booking status (used by success page)
 * @route GET /booking/verify/:sessionId
 */
export const verifyCheckoutSession = catchAsync(async (req, res) => {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const bookingId = session.metadata.bookingId;
    const booking = await Booking.findById(bookingId).populate('campground');

    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }

    // If webhook hasn't fired yet but payment is complete, update now
    if (booking.status === 'pending' && session.payment_status === 'paid') {
        booking.status = 'paid';
        booking.paymentIntentId = session.payment_intent;
        await booking.save();
    }

    res.status(200).json({
        booking: {
            _id: booking._id,
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalPrice: booking.totalPrice,
            status: booking.status,
            campground: booking.campground
                ? { name: booking.campground.name, location: booking.campground.location, _id: booking.campground._id }
                : null
        },
        paymentStatus: session.payment_status
    });
});

/**
 * Fetch all active future bookings for a specific campground (used for disabling calendar dates)
 * @route GET /campgrounds/:id/bookings
 */
export const getBookingsForCampground = catchAsync(async (req, res) => {
    const { id } = req.params;

    const bookings = await Booking.find({
        campground: id,
        status: { $in: ['paid', 'confirmed', 'completed'] },
        endDate: { $gte: new Date() } // Only future/current bookings
    }).select('startDate endDate');

    res.status(200).json(bookings);
});

/**
 * Cancel a booking and issue a refund via Stripe if applicable
 * @route POST /bookings/:bookingId/cancel
 */
export const cancelBooking = catchAsync(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only cancel your own bookings' });
    }

    if (booking.status === 'cancelled') {
        return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Issue Stripe refund if payment was made
    if (booking.paymentIntentId) {
        try {
            await stripe.refunds.create({
                payment_intent: booking.paymentIntentId,
            });
            console.log(`Refund issued for booking ${bookingId}`);
        } catch (err) {
            console.error('Stripe refund failed:', err.message);
            return res.status(500).json({ message: 'Refund failed. Please try again or contact support.' });
        }
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled and refund issued successfully' });
});
