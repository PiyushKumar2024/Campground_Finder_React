import catchAsync from '../helper/catchAsync.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const registerUser=catchAsync(async(req,res,next)=>{
        const {username,email,password}=req.body;
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'User already exist'});
        }
        const user=new User({username,email});
        //use register for registering 
        const registeredUser=await User.register(user,password);
        const token=jwt.sign({id:registeredUser._id,username},process.env.JWT_SECRET || 'fallback-secret-for-dev',{expiresIn:'7d'});
        res.status(200).json({message:'Successfully Registered',token})
})

export const loginUser=(req,res)=>{
    // passport.authenticate('local') has already verified the user and attached it to req.user
    const { _id, username } = req.user;
    const token = jwt.sign({ id: _id, username }, process.env.JWT_SECRET || 'fallback-secret-for-dev', { expiresIn: '7d' });
    res.status(200).json({ message: 'Welcome back', token });
}

// For JWT, logout is handled on the client side by deleting the token.