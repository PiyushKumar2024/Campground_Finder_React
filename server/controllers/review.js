import catchAsync from '../helper/catchAsync.js'
import appError from '../helper/error-class.js'
import Campground from '../models/campground.js'
import Review from '../models/review.js'
import reviewChecker from '../models/reviewValidity.js'

export const createReview=catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id)
    const review=new Review(req.body.review)
    review.author=req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    console.log(campground)
    req.flash('success','The review is successfully added')
    res.redirect(`/campgrounds/${campground._id}`)
})

export const deleteReview=catchAsync(async(req,res)=>{
    const {id,reviewId}=req.params
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','The review is successfully deleted')
    res.redirect(`/campgrounds/${id}`)
})