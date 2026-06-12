/**
 * @file index.js
 * @description Main entry point for the Explorion Express backend server.
 * Handles database connection, middleware configuration, authentication strategy setup,
 * routing, and global error handling.
 */
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import campgroundsRoutes from './routes/campground.js';
import reviewsRoutes from './routes/reviews.js';
import authenticationRoutes from './routes/user.js';
import bookingRoutes from './routes/booking.js';
import tripPlannerRoutes from './routes/tripPlanner.js';
import placesRoutes from './routes/places.js';
import { handleStripeWebhook } from './controllers/bookings.js';
import dotenv from 'dotenv';
import passport from 'passport';
import configureJwtStrategy from './config/passport.js';
import User from './models/user.js';
import { Strategy as LocalStrategy } from 'passport-local';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGOURL = process.env.MONGO_URL;

if (!MONGOURL) {
    console.error("CRITICAL ERROR: MONGO_URL is missing. Make sure you have a .env file with this variable.");
}

/**
 * Connect to MongoDB database
 */
mongoose.connect(MONGOURL)
    .then(() => {
        console.log('Successfully connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

/**
 * Global Middleware Setup
 */
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Stripe webhook needs raw body parsing — must be mounted BEFORE express.json()
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

/**
 * Authentication Setup
 */
app.use(passport.initialize()); // Initialize Passport.js for authentication
// Local Strategy for username/password login (provided by passport-local-mongoose)
passport.use(new LocalStrategy(User.authenticate()));
// JWT Strategy for stateless API authentication
configureJwtStrategy(passport);

/**
 * API Routes Setup
 */
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.use('/', authenticationRoutes);
app.use('/', bookingRoutes);
app.use('/api/trip', tripPlannerRoutes);
app.use('/api/places', placesRoutes);

/**
 * Global Error Handling Middleware
 * Catches errors thrown in routes or passed via next(err)
 */
app.use((err, req, res, next) => {
    // Default message and status code
    if (!err.message) err.message = 'Something went wrong';
    if (!err.status) err.status = 500;
    
    console.error('Global Error Handler:', err);
    
    // Return a JSON response containing error details (stack trace only in dev)
    res.status(err.status).json({ 
        message: err.message, 
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    });
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
