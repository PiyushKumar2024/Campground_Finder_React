import Campground from '../models/campground.js';

export const validateImages = async (req, res, next) => {
    const maxImages = 5;
    // req.files is populated by Multer (files are already on Cloudinary at this point)
    const newFiles = req.files || [];
    const newFilesCount = newFiles.length;

    // Helper to cleanup uploaded files if validation fails
    const cleanupFiles = async () => {
        for (let file of newFiles) {
            if (file.public_id) {
                await cloudinary.uploader.destroy(file.public_id);
            }
        }
    };

    try {
        if (req.method === 'POST') {
            if (newFilesCount > maxImages) {
                await cleanupFiles();
                return res.status(400).json({ message: `You can only upload a maximum of ${maxImages} images.` });
            }
        } else if (req.method === 'PATCH' || req.method === 'PUT') {
            const { id } = req.params;
            const camp = await Campground.findById(id);
            
            if (!camp) {
                await cleanupFiles();
                return res.status(404).json({ message: 'Campground not found' });
            }

            let deleteCount = 0;
            if (req.body.deleteImages) {
                // Handle case where deleteImages is a single string or an array
                const deleteImages = Array.isArray(req.body.deleteImages) ? req.body.deleteImages : [req.body.deleteImages];
                deleteCount = deleteImages.length;
            }

            const currentCount = camp.image.length;
            const totalAfterUpdate = currentCount - deleteCount + newFilesCount;

            if (totalAfterUpdate > maxImages) {
                await cleanupFiles();
                return res.status(400).json({ 
                    message: `Total images cannot exceed ${maxImages}. Current: ${currentCount}, Deleting: ${deleteCount}, Adding: ${newFilesCount}.` 
                });
            }
        }
        next();
    } catch (error) {
        await cleanupFiles();
        next(error);
    }
};

//In a standard JSON request, you can validate the data before doing anything else. 
// However, when handling file uploads with multipart/form-data (which is what your form sends), 
// Express cannot read req.body or req.files until the multer middleware runs.
