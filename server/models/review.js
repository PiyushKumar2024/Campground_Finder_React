import mongoose from 'mongoose';
import {review} from '../schemas/reviewSchema.js';

export default mongoose.model('Review', review);
