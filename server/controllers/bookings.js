import catchAsync from '../helper/catchAsync.js';
import Booking from '../models/booking.js';
import Campground from '../models/campground.js';

// Create a new booking
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

    // Check for overlapping bookings
    const overlapping = await Booking.findOne({
        campground: id,
        status: { $ne: 'cancelled' },
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

    // Create booking
    const booking = new Booking({
        startDate: start,
        endDate: end,
        campground: id,
        user: req.user._id,
        totalPrice,
        status: 'confirmed'
    });

    await booking.save();

    res.status(201).json({
        message: 'Booking created successfully',
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

// Get all bookings for a campground (for calendar display)
export const getBookingsForCampground = catchAsync(async (req, res) => {
    const { id } = req.params;

    const bookings = await Booking.find({
        campground: id,
        status: { $ne: 'cancelled' },
        endDate: { $gte: new Date() } // Only future/current bookings
    }).select('startDate endDate');

    res.status(200).json(bookings);
});

// Cancel a booking
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

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled successfully' });
});
