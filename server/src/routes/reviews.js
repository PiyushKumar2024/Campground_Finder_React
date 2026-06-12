/**
 * @file reviews.js
 * @description Express routes for campground reviews.
 * Includes authorization to ensure users can only delete their own reviews.
 */
import express from 'express';
import { isLoggedIn, verifyReviews, isReviewAuthor } from '../middlewares/middleware.js';
import { createReview, deleteReview } from '../controllers/review.js';

const router = express.Router({ mergeParams: true });

/**
 * @route POST /campgrounds/:id/reviews
 * @description Create a new review for a campground
 * @access Protected (Requires Login, verified via middleware)
 */
router.post('/', isLoggedIn, verifyReviews, createReview);

/**
 * @route DELETE /campgrounds/:id/reviews/:reviewId
 * @description Delete a specific review
 * @access Protected (Requires Login, Must be Review Author)
 */
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, deleteReview);

export default router;
