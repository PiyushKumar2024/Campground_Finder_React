import mongoose from 'mongoose';
import Review from './review.js';
import { cloudinary } from '../config/cloudinary.js';
import {campgrounds} from '../schemas/campgroundSchema.js';

 campgrounds.post('findOneAndDelete',async function(doc){
    console.log('Delete a campground')
    console.log(doc)
    if(doc){
         await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
        if (doc.image && doc.image.length) {
            for (const img of doc.image) {
                await cloudinary.uploader.destroy(img.imageId);
            }
        }
    }
 })

export default mongoose.model('Campground', campgrounds)