import catchAsync from '../helper/catchAsync.js';
import Campground from '../models/campground.js';
import { cloudinary } from '../config/cloudinary.js';
import * as maptilerClient from '@maptiler/client';

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

//get the data for update camp page from show one camp and use it
export const loadAllCampground = catchAsync(async (req, res) => {
    const data = await Campground.find({});
    res.status(200).json(data);
})

export const createNewCampground = catchAsync(async (req, res) => {
    const { name, price, location, description, amenity, authorDesc, checkin, checkout, camprules } = req.body;
    const camp = new Campground({ name, price, description, location, amenity, authorDesc, checkin, checkout, camprules });
    camp.author = req.user._id;
    camp.image = req.files.map(f => ({ url: f.url, imageId: f.public_id }));
    const geoData = await maptilerClient.geocoding.forward(location);
    if (!geoData.features || !geoData.features.length) {
        throw new Error('Location not found. Please enter a valid location.');
    }
    camp.campLocation=geoData.features[0].geometry;

    //at saving mong will check the validations
    await camp.save();
    res.status(201).json({ message: 'The campground is successfully created', _id: camp._id });
})

export const updateCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    if(req.body.location){
        const geoData = await maptilerClient.geocoding.forward(req.body.location);
        if (!geoData.features || !geoData.features.length) {
            throw new Error('Location not found. Please enter a valid location.');
        }
        req.body.campLocation=geoData.features[0].geometry;
    }
    const camp=await Campground.findByIdAndUpdate(id,req.body,{new:true});
    if(req.files){
        const imgs = req.files.map(f => ({ url: f.url, imageId: f.public_id }));
        camp.image.push(...imgs);
    }
    await camp.save();
    if(req.body.deleteImages){
        //Handling Single vs. Multiple Deletions: When sending deleteImages via FormData, 
        // if only one image is selected, multer parses it as a string. If multiple are selected, 
        // it parses it as an array. Your controller currently iterates over req.body.deleteImages directly, 
        // which will cause a crash or unexpected behavior if it's a string (it will iterate over the characters of the string)
        const deleteImages = Array.isArray(req.body.deleteImages) ? req.body.deleteImages : [req.body.deleteImages];
        for(let imgId of deleteImages){
            await cloudinary.uploader.destroy(imgId);
        }
        await camp.updateOne({ $pull: { image: { imageId: { $in: deleteImages } } } });
        // Update the camp object in memory so the response reflects the deletion
        camp.image = camp.image.filter(img => !deleteImages.includes(img.imageId));
        console.log(camp);
    }
    if (!camp) return res.status(404).json({ message: 'Campground not found' });
    res.status(200).json({ message: 'The campground is successfully updated', camp });
})

export const deleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    //deletion from cloudinary is handled in schema
    if (!deletedCamp) return res.status(404).json({ message: 'Campground not found' });
    res.status(200).json({ message: 'The campground is successfully deleted' });
})

export const showOneCampground = catchAsync(async (req, res) => {
    const { id } = req.params
    /* faster query for dbS
    const camp=await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');*/
    const camp = await Campground.findById(id).populate('reviews').populate('author');
    for (const review of camp.reviews) {
        await review.populate('author');
    }
    if (!camp) {
        return res.status(404).json({ message: 'The campground does not exist' });
    }
    res.status(200).json(camp);
})
