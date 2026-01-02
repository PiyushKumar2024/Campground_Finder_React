import catchAsync from '../helper/catchAsync.js';
import campgroundsChecker from '../models/campgroundValidity.js';
import reviewChecker from '../models/reviewValidity.js';
import { userValidity } from '../models/userValidity.js';
import Campground from '../models/campground.js';
import Review from '../models/review.js';
import User from '../models/user.js';
import passport from 'passport';

// Use Passport's JWT strategy to protect routes.
// This automatically checks the 'Authorization' header for the token.
// and attaches the user to req.user if the token is valid.
//returns a middleware
//dont wrap it in catchAsync as it handles it own errors
export const isLoggedIn = passport.authenticate('jwt', { session: false });

export const isAuthor=catchAsync(async (req,res,next)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    if(!camp){
        return res.status(404).json({message:"No campground found"})
    }
    if(!camp.author.equals(req.user._id)){
        return res.status(403).json({message:"You are not authorized to do this"})
    }
    next();
})

export const isReviewAuthor=catchAsync(async (req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review){
        return res.status(404).json({message:"Review not found"})
    }
    if(!review.author.equals(req.user._id)){
        return res.status(403).json({message:"You are not authorized to do this"})
    }
    next();
})

export const verifyCampgrounds = (req, res, next) => {
    const validation = campgroundsChecker.validate(req.body)
    if(validation.error){
        const message = validation.error.details.map(detail => detail.message).join(',')
        return res.status(400).json({ message })
    }
    else{
        // Joi returns the validated object, which might have defaults applied.
        // It's good practice to use this validated object going forward.
        req.body = validation.value;

        // Ensure fields that should be arrays are arrays, even if only one value is submitted from a form.
        if (req.body.camprules && !Array.isArray(req.body.camprules)) {
            req.body.camprules = [req.body.camprules];
        }
        next();
    }
}

export const verifyReviews = (req, res, next) => {
    console.log(req.body.review)
    const validation=reviewChecker.validate(req.body.review)
    if(validation.error){
        const message=validation.error.details.map(detail => detail.message).join(',')
        return res.status(400).json({ message })
    }
    else{
        //for next call
        next()
    }
}

export const verifyUser=(req,res,next)=>{
    const validation=userValidity.validate(req.body);
    if(validation.error){
        const message=validation.error.details.map(detail => detail.message).join(',')
        return res.status(400).json({ message })
    }
    else{
        //
        req.body = validation.value;
        next()
    }
}

export const isAccountOwner = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (!user._id.equals(req.user._id)) {
        return res.status(403).json({ message: "You are not authorized to do this" });
    }
    next();
})

//Joi Validation Behavior: When you run userValidity.validate(req.body), 
// Joi checks the data. If a field like role is missing but has a .default('camper') 
// defined in your schema, Joi does not modify the original req.body. Instead, it returns 
// a new object inside validation.value that contains the input data plus the default values.