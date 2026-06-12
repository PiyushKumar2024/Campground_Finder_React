/**
 * @file user.js
 * @description Controllers for user authentication, registration, profile management, and favorites.
 */
import catchAsync from '../helper/catchAsync.js';
import User from '../models/user.js';
import '../models/campground.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { cloudinary } from '../config/cloudinary.js';

dotenv.config();

/**
 * Register a new user
 * @route POST /register
 */
export const registerUser = catchAsync(async (req, res, next) => {
    const { password, ...userData } = req.body;

    // Prevent users from self-assigning admin role during registration
    if (userData.role === 'admin') {
        return res.status(403).json({ message: 'Cannot register as admin' });
    }

    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exist' });
    }
    const user = new User({ ...userData, joined: new Date() });
    if (req.file) {
        user.image = { url: req.file.url, imageId: req.file.public_id }
    }
    //use register for registering 
    const registeredUser = await User.register(user, password);
    const token = jwt.sign({ id: registeredUser._id, username: registeredUser.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ message: 'Successfully Registered', token, user: { id: registeredUser._id, username: registeredUser.username, email: registeredUser.email, image: registeredUser.image, favorites: registeredUser.favorites } });
})

/**
 * Login an existing user and return a JWT
 * @route POST /login
 */
export const loginUser = (req, res) => {
    // passport.authenticate('local') has already verified the user and attached it to req.user
    const { _id, username, email, image, favorites } = req.user;
    const token = jwt.sign({ id: _id, username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ message: 'Welcome back', token, user: { id: _id, username, email, image, favorites } });
}

/**
 * Update user profile information and/or avatar
 * @route PUT /user/:id
 */
export const updateUserInfo = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { joined, role, ...updateData } = req.body;
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.file) {
        if (user.image && user.image.imageId) {
            await cloudinary.uploader.destroy(user.image.imageId);
        }
        user.image = { url: req.file.url, imageId: req.file.public_id };
        await user.save();
    }
    //for the frontend to have the campground data
    await user.populate('campgrounds');
    res.status(200).json({ message: 'User updated successfully', user });
})

/**
 * Fetch complete user profile including their campgrounds, bookings, and favorites
 * @route GET /user/:id
 */
export const showUserInfo = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)
        .populate('campgrounds')
        .populate({
            path: 'bookings',
            populate: { path: 'campground', select: 'name image location' }
        })
        .populate('favorites');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
})
/**
 * Add a campground to user's favorites
 * @route POST /user/:id/favorites/:campId
 */
export const addFavorite = catchAsync(async (req, res) => {
    const { id, campId } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (!user.favorites.includes(campId)) {
        user.favorites.push(campId);
        await user.save();
    }
    
    res.status(200).json({ message: 'Added to favorites', favorites: user.favorites });
});

/**
 * Remove a campground from user's favorites
 * @route DELETE /user/:id/favorites/:campId
 */
export const removeFavorite = catchAsync(async (req, res) => {
    const { id, campId } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.favorites = user.favorites.filter(favId => favId.toString() !== campId);
    await user.save();
    
    res.status(200).json({ message: 'Removed from favorites', favorites: user.favorites });
});

// For JWT, logout is handled on the client side by deleting the token.