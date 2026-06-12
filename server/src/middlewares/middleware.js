/**
 * @file middleware.js
 * @description Global Express middleware functions for authentication, authorization, and data validation.
 */
import catchAsync from '../helper/catchAsync.js';
import campgroundsChecker from '../models/campgroundValidity.js';
import reviewChecker from '../models/reviewValidity.js';
import { userValidity } from '../models/userValidity.js';
import Campground from '../models/campground.js';
import Review from '../models/review.js';
import User from '../models/user.js';
import passport from 'passport';

/**
 * Authentication Middleware
 * Uses Passport's JWT strategy to verify the 'Authorization' header token.
 * If valid, it attaches the decoded user object to req.user.
 */
export const isLoggedIn = passport.authenticate('jwt', { session: false });

/**
 * Authorization Middleware: Campground Author
 * Ensures the logged-in user is the creator of the campground being modified.
 */
export const isAuthor = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        return res.status(404).json({ message: "No campground found" })
    }
    if (!camp.author.equals(req.user._id)) {
        return res.status(403).json({ message: "You are not authorized to do this" })
    }
    next();
})

/**
 * Authorization Middleware: Review Author
 * Ensures the logged-in user is the creator of the review being deleted.
 */
export const isReviewAuthor = catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({ message: "Review not found" })
    }
    if (!review.author.equals(req.user._id)) {
        return res.status(403).json({ message: "You are not authorized to do this" })
    }
    next();
})

/**
 * Validation Middleware: Campground Payload
 * Validates incoming campground creation/update data against the Joi schema.
 */
export const verifyCampgrounds = (req, res, next) => {
    const validation = campgroundsChecker.validate(req.body)
    if (validation.error) {
        const message = validation.error.details.map(detail => detail.message).join(',')
        return res.status(400).json({ message })
    }
    else {
        // Joi returns the validated object, which might have defaults applied.
        // It's good practice to use this validated object going forward.
        req.body = validation.value;

        // Ensure fields that should be arrays are arrays, even if only one value is submitted from a form.
        if (req.body.camprules && !Array.isArray(req.body.camprules)) {
            req.body.camprules = [req.body.camprules];
        }
        next();
    }
}

/**
 * Validation Middleware: Review Payload
 * Validates incoming review data against the Joi schema.
 */
export const verifyReviews = (req, res, next) => {
    const validation = reviewChecker.validate(req.body.review)
    if (validation.error) {
        const message = validation.error.details.map(detail => detail.message).join(',')
        return res.status(400).json({ message })
    }
    else {
        //for next call
        next()
    }
}

/**
 * Validation Middleware: User Registration/Update Payload
 * Validates incoming user data against the Joi schema and applies defaults.
 */
export const verifyUser = (req, res, next) => {
    const validation = userValidity.validate(req.body);
    if (validation.error) {
        const message = validation.error.details.map(detail => detail.message).join(',')
        return res.status(400).json({ message })
    }
    else {
        //
        req.body = validation.value;
        next();
    }
}

/**
 * Authorization Middleware: Account Owner
 * Ensures the logged-in user can only modify their own profile data.
 */
export const isAccountOwner = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (!user._id.equals(req.user._id)) {
        return res.status(403).json({ message: "You are not authorized to do this" });
    }
    next();
})