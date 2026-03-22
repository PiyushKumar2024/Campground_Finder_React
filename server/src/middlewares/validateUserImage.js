import { cloudinary } from '../config/cloudinary.js';

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
