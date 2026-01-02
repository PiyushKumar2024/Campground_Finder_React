import catchAsync from '../helper/catchAsync.js';
import User from '../models/user.js';
import '../models/campground.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { cloudinary } from '../config/cloudinary.js';

dotenv.config();

export const registerUser=catchAsync(async(req,res,next)=>{
        const { password, ...userData } = req.body;
        const existingUser=await User.findOne({email: userData.email});
        if(existingUser){
            return res.status(400).json({message:'User already exist'});
        }
         const user=new User({...userData, joined: new Date()});
        if(req.file){
            user.image={url:req.file.url,imageId:req.file.public_id}
        }
        //use register for registering 
        const registeredUser=await User.register(user,password);
        const token=jwt.sign({id:registeredUser._id,username:registeredUser.username},process.env.JWT_SECRET || 'fallback-secret-for-dev',{expiresIn:'7d'});
        res.status(200).json({message:'Successfully Registered',token,user:{id:registeredUser._id,username:registeredUser.username,email:registeredUser.email, image: registeredUser.image}});
})

export const loginUser=(req,res)=>{
    // passport.authenticate('local') has already verified the user and attached it to req.user
    const { _id, username, email, image } = req.user;
    const token = jwt.sign({ id: _id, username }, process.env.JWT_SECRET || 'fallback-secret-for-dev', { expiresIn: '7d' });
    res.status(200).json({ message: 'Welcome back', token, user: { id: _id, username, email, image } });
}

export const updateUserInfo = catchAsync(async (req, res) => {
    console.log(req.body);
    const {id}=req.params;
    const { joined, ...updateData } = req.body;
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.file) {
        if (user.image && user.image.imageId) {
            await cloudinary.uploader.destroy(user.image.imageId);
        }
        user.image = { url: req.file.url, imageId: req.file.public_id };
        await user.save();
    }
    //for the frontend to have the campground data
    await user.populate('campgrounds');
    res.status(200).json({ message: 'User updated successfully', user });
})

export const showUserInfo = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate('campgrounds');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
})

// For JWT, logout is handled on the client side by deleting the token.