import catchAsync from '../helper/catchAsync.js'
import Campground from '../models/campground.js'
import Review from '../models/review.js'

export const createReview=catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    if(!campground) return res.status(404).json({message:'Campground not found'});
    const review=new Review(req.body.review);
    review.author=req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    await review.populate('author');
    res.status(201).json({message:'Successfully added review', review});
})

export const deleteReview=catchAsync(async(req,res)=>{
    const {id,reviewId}=req.params;
    const camp=await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    const rev=await Review.findByIdAndDelete(reviewId);
    if(rev && camp) return res.status(200).json({message:'successfully deleted review'});
    res.status(404).json({message:'Cannot delete review or update camp try again'});
})