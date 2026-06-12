/**
 * @file cloudinary.js
 * @description Configuration for Cloudinary image hosting.
 * Sets up the Cloudinary API credentials and the Multer storage engine
 * for uploading campground images directly to Cloudinary.
 */
import cloudinaryModule from 'cloudinary';
import pkg from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudinary = cloudinaryModule.v2;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

/**
 * Cloudinary API Configuration
 */
cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
});

// Fallback for different module import structures
const CloudinaryStorage = pkg.CloudinaryStorage || pkg.default?.CloudinaryStorage || pkg.default || pkg;

/**
 * Multer Storage Configuration
 * Directs uploaded files to the 'Campground_Finder' folder in Cloudinary
 */
const storage = new CloudinaryStorage({
    cloudinary: cloudinaryModule,
    params: {
        folder: 'Campground_Finder',
        allowedFormats: ['jpeg', 'png', 'jpg'],
        resource_type: 'auto', // Auto-detect file type (image vs video)
        timeout: 60000 // Wait up to 60s for upload
    }
});

export { cloudinary, storage };