import mongoose from 'mongoose';
const Schema=mongoose.Schema;
import Review from './review.js';
import User from './user.js';
import { cloudinary } from '../cloudinary/cloudinary.js';

 const campgrounds=new Schema({
     name:{
         type:String,
         required:true
     },
     price:{
         type:Number,
         required:true
     },
     description:{
         type:String,
         required:true
     },
     location:{
         type:String,
         required:true
     },
     image:{
         type:[
            {
                url:{
                    type:String,
                    required:true
                },
                imageId:{
                    type:String,
                    required:true
                }
            }
         ],
         required:true
     },
     //author will be singular but there can be many reviews
     author:{
        type:Schema.Types.ObjectId,
        ref:'User'
     },
     reviews:[{
         type:Schema.Types.ObjectId,
         ref:'Review'
     }]
 })

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