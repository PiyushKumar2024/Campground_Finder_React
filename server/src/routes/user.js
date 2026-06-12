/**
 * @file user.js
 * @description Express routes for user authentication, profile management, and favorites.
 * Handles user avatar uploads via Multer and Cloudinary.
 */
import express from 'express';
import passport from 'passport';
import { registerUser, loginUser, showUserInfo, updateUserInfo, addFavorite, removeFavorite } from '../controllers/user.js';
import { verifyUser, isLoggedIn, isAccountOwner } from '../middlewares/middleware.js';
import multer from 'multer';
import { storage } from '../config/cloudinary.js'
import { validateUserImage } from '../middlewares/validateUserImage.js';

const router = express.Router();

/**
 * Configure Multer for user avatar uploads
 * Implements a 5MB file size limit and restricts uploads to image MIME types.
 */
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB per file
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only images are allowed'), false);
        }
        cb(null, true);
    }
});

/**
 * @route POST /user/register
 * @description Register a new user with an optional avatar image
 * @access Public
 */
router.post('/user/register', upload.single('image'), validateUserImage, verifyUser, registerUser);

/**
 * @route POST /user/login
 * @description Login an existing user using Passport's local strategy
 * @access Public
 */
router.post('/user/login', passport.authenticate('local', { session: false }), loginUser);

/**
 * @route POST /user/:id
 * @description Update user profile information and avatar
 * @access Protected (Requires Login, Must be Account Owner)
 */
router.post('/user/:id', isLoggedIn, isAccountOwner, upload.single('image'), validateUserImage, verifyUser, updateUserInfo);

/**
 * @route GET /user/:id
 * @description Fetch user profile details
 * @access Protected (Requires Login)
 */
router.get('/user/:id', isLoggedIn, showUserInfo);

/**
 * @route POST /user/:id/favorites/:campId
 * @description Add a campground to user's favorites
 * @access Protected (Requires Login, Must be Account Owner)
 * 
 * @route DELETE /user/:id/favorites/:campId
 * @description Remove a campground from user's favorites
 * @access Protected (Requires Login, Must be Account Owner)
 */
router.post('/user/:id/favorites/:campId', isLoggedIn, isAccountOwner, addFavorite);
router.delete('/user/:id/favorites/:campId', isLoggedIn, isAccountOwner, removeFavorite);

export default router;