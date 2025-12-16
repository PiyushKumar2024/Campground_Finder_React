import catchAsync from '../helper/catchAsync.js';
import User from '../models/user.js';
import passport from 'passport';
import {storeReturnTo} from '../middleware.js';

export const showRegPage=(req,res)=>{
    res.status(200).json({message:"OK"});
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
            return res.status(200).json({message:'successfully logged in'});
        })
    } catch (e) {
        res.status(404).json({message:e.message});
    }
})

export const showLoginPage=(req,res)=>{
    res.status(200).json({message:"OK"});
}

export const loginUser=(req,res)=>{
    const redirectUrl=res.locals.returnTo || '/campgrounds';
    res.status(200).json({ message: 'Welcome back', redirectUrl });
}

export const logoutUser=(req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        return res.status(200).json({ message: 'successfully logged out' });
    });
}