/**
 * @file bookingSchema.js
 * @description Mongoose schema definition for Campground Bookings.
 */
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const bookingSchema = new Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    campground: {
        type: Schema.Types.ObjectId,
        ref: 'Campground',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentIntentId: {
        type: String
    },
    stripeSessionId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
