/**
 * @file validateUserImage.js
 * @description Middleware for managing user avatar uploads.
 * Attaches a cleanup function to the request so subsequent validation middlewares
 * can delete the uploaded image from Cloudinary if their validation fails.
 */
import { cloudinary } from '../config/cloudinary.js';

/**
 * Creates and attaches a Cloudinary cleanup function to the request object.
 */
export const validateUserImage = async (req, res, next) => {
    // req.file is populated by Multer (file is already on Cloudinary at this point)
    const file = req.file;

    // Helper to cleanup uploaded file if validation fails
    const cleanupFile = async () => {
        if (file && file.public_id) {
            await cloudinary.uploader.destroy(file.public_id);
        }
    };

    try {
        // Attach cleanup function to req so it can be used by subsequent middlewares
        req.cleanupUserImage = cleanupFile;
        next();
    } catch (error) {
        await cleanupFile();
        next(error);
    }
};
