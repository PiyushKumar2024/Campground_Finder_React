import cloudinaryModule from 'cloudinary';
import pkg from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudinary = cloudinaryModule.v2;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
});

const CloudinaryStorage = pkg.CloudinaryStorage || pkg.default?.CloudinaryStorage || pkg.default || pkg;

const storage = new CloudinaryStorage({
    cloudinary: cloudinaryModule,
    params: {
        folder: 'Campground_Finder',
        allowedFormats: ['jpeg', 'png', 'jpg'],
        resource_type: 'auto', //auto detect file type
        timeout: 60000 //wait upto 60s
    }
});

export { cloudinary, storage };