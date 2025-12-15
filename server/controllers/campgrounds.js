import catchAsync from '../helper/catchAsync.js';
import appError from '../helper/error-class.js';
import Campground from '../models/campground.js';
import Review from '../models/review.js';
import campgroundsChecker from '../models/campgroundValidity.js';
import flash from 'connect-flash';

export const loadAllCampground=catchAsync(async(req,res)=>{
    const data=await Campground.find({})
    res.render('home',{data})
})

export const createNewCampground=catchAsync(async(req,res)=>{
    const {name,price,location,description}=req.body
    const camp=new Campground({name,price,location,description})
    camp.author=req.user;
    console.log(req.user);
    await camp.save()
    req.flash('success','The campground is successfully created')//set up flash
    res.redirect('/campgrounds') //to display it just set up a middleware
})

export const loadUpdatePage=catchAsync(async(req,res)=>{
    const {id}=req.params;
    const data=await Campground.findById(id);
    res.render('update.ejs',{data})
})

export const updateCampground=catchAsync(async(req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findByIdAndUpdate(id,req.body);
    req.flash('success','The campground is successfully updated');
    res.redirect(`/campgrounds/${id}`);
})

export const deleteCampground=catchAsync(async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success','The campground is successfully deleted')
    res.redirect('/campgrounds')
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
        req.flash('error',"The campground doesnt exist")
        return res.redirect('/campgrounds')
    }
    res.render('campground',{camp})
})

export const newCampPage=(req,res)=>{
    res.render('new-camp')
}