import mongoose from 'mongoose';
import { pointSchema } from './pointSchema.js';
const Schema = mongoose.Schema;

export const user = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    joined:{
        type:Date,
        required:true
    },
    geometry: {
        type: pointSchema,
        required: false
    },
    bio:{
        type:String,
        required:true
    },
    phoneNum:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    image: {
        url: String,
        imageId: String
    }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } }); //for virtuals 

//look into Campground collection and match the localField of the user collection and foreigh field of 
//Campground collection where author._id==_id 
user.virtual('campgrounds', {
    ref: 'Campground',
    localField: '_id',
    foreignField: 'author'
});

//Important: unique:true is an index hint
// not a validation rule. Mongoose won’t perform a synchronous uniqueness check
// race conditions can still produce duplicates unless the DB index exists and you handle duplicate-key errors (E11000).