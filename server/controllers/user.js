import catchAsync from '../helper/catchAsync.js';
import User from '../models/user.js';
import passport from 'passport';
import {storeReturnTo} from '../middleware.js';

export const showRegPage=(req,res)=>{
    res.render('register.ejs');
}

export const registerUser=catchAsync(async(req,res,next)=>{
    try {
        const {username,email,password}=req.body;
        const user=new User({username,email});
        //use register for registering 
        const registeredUser=await User.register(user,password);
        req.login(registeredUser,function(err){
            if(err){
                return next(err);
            }
            req.flash('success','Successfully registered you as the new user');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error',e.message);
        res.redirect('/register');
    }
})

export const showLoginPage=(req,res)=>{
    res.render('login.ejs')
}

export const loginUser=(req,res)=>{
    req.flash('success','Welcome back');
    const redirectUrl=res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

export const logoutUser=(req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}