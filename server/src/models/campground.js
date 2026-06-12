/**
 * @file campground.js
 * @description Mongoose model for Campgrounds.
 * Includes middleware for cascading deletes of associated reviews and Cloudinary images.
 */
import mongoose from 'mongoose';
import Review from './review.js';
import { cloudinary } from '../config/cloudinary.js';
import {campgrounds} from '../schemas/campgroundSchema.js';

/**
 * Post-delete middleware
 * Triggers when a campground is deleted to clean up orphaned reviews and images.
 */
campgrounds.post('findOneAndDelete', async function (doc) {
    if (doc) {
         await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
        if (doc.image && doc.image.length) {
            for (const img of doc.image) {
                await cloudinary.uploader.destroy(img.imageId);
            }
        }
    }
 })

export default mongoose.model('Campground', campgrounds)