/**
 * @file campground.js
 * @description Express routes for campground CRUD operations.
 * Handles image uploads via Multer and Cloudinary, as well as authorization checks.
 */
import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js'
import { isLoggedIn, isAuthor, verifyCampgrounds } from '../middlewares/middleware.js';
import {
    updateCampground, deleteCampground, createNewCampground,
    loadAllCampground, showOneCampground, loadCampgroundCoordinates
} from '../controllers/campgrounds.js';
import { validateImages } from '../middlewares/validateImages.js';

const router = express.Router();
/**
 * Configure Multer for image uploads
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
 * @route GET /campgrounds
 * @description Fetch all campgrounds with pagination, filtering, and sorting
 * 
 * @route POST /campgrounds
 * @description Create a new campground with image upload
 * @access Protected (Requires Login, verified via middleware)
 */
router.route('/')
    .get(loadAllCampground)
    .post(isLoggedIn, upload.array('image'), validateImages, verifyCampgrounds, createNewCampground)

/**
 * @route GET /campgrounds/coordinates
 * @description Lightweight endpoint to fetch only campground coordinates for the map
 * Important: Must be placed BEFORE /:id to prevent 'coordinates' from being parsed as an ID
 */
router.route('/coordinates')
    .get(loadCampgroundCoordinates)

/**
 * @route GET /campgrounds/:id
 * @description Fetch details of a specific campground
 * 
 * @route PATCH /campgrounds/:id
 * @description Update an existing campground and upload new images
 * @access Protected (Requires Login, Must be Author)
 * 
 * @route DELETE /campgrounds/:id
 * @description Delete a campground entirely
 * @access Protected (Requires Login, Must be Author)
 */
router.route('/:id')
    .patch(isLoggedIn, isAuthor, upload.array('image'), validateImages, verifyCampgrounds, updateCampground)
    .delete(isLoggedIn, isAuthor, deleteCampground)
    .get(showOneCampground)

export default router;