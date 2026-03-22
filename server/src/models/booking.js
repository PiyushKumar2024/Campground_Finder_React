import mongoose from 'mongoose';
import { bookingSchema } from '../schemas/bookingSchema.js';

export default mongoose.model('Booking', bookingSchema);
