import catchAsync from '../helper/catchAsync.js';
import appError from '../helper/error-class.js';
import Campground from '../models/campground.js';
import Review from '../models/review.js';
import campgroundsChecker from '../models/campgroundValidity.js';

//get the data for update camp page from show one camp and use it

export const loadAllCampground=catchAsync(async(req,res)=>{
    const data=await Campground.find({});
    res.status(200).json(data);
})

export const createNewCampground=catchAsync(async(req,res)=>{
    const {name,price,location,description}=req.body;
    const camp=new Campground({name,price,location,description});
    camp.author=req.user._id;
    await camp.save();
    res.status(201).json({ message: 'The campground is successfully created', id: camp._id });
})

export const updateCampground=catchAsync(async(req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findByIdAndUpdate(id,req.body, { new: true });
    if (!camp) return res.status(404).json({ message: 'Campground not found' });
    res.status(200).json({ message: 'The campground is successfully updated', camp });
})

export const deleteCampground=catchAsync(async(req,res)=>{
    const {id}=req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    if (!deletedCamp) return res.status(404).json({ message: 'Campground not found' });
    res.status(200).json({ message: 'The campground is successfully deleted' });
})

export const showOneCampground=catchAsync(async(req,res)=>{
    const {id}=req.params
    /* faster query for dbS
    const camp=await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');*/
    const camp=await Campground.findById(id).populate('reviews').populate('author');
    for(const review of camp.reviews){
        await review.populate('author');
    }
    if(!camp){
        return res.status(404).json({ message: 'The campground does not exist' });
    }
    res.status(200).json(camp);
})
