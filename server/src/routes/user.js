import express from 'express';
import passport from 'passport';
import { registerUser, loginUser, showUserInfo, updateUserInfo } from '../controllers/user.js';
import { verifyUser, isLoggedIn, isAccountOwner } from '../middlewares/middleware.js';
import multer from 'multer';
import {storage} from '../config/cloudinary.js'
import { validateUserImage } from '../middlewares/validateUserImage.js';

const router=express.Router();

const upload=multer({
    storage,
    limits:{fileSize:5*1024*1024}, //cant upload greater than 5MB
    fileFilter:(req,file,cb)=>{ //check for mime type and then sends it
        if(!file.mimetype.startsWith('image/')){
            return cb(new Error('only images are allowed'),false);
        }
        cb(null,true);
    }
});

router.post('/user/register', upload.single('image'), validateUserImage, verifyUser, registerUser);

// The 'local' strategy checks username/password in req.body. It does NOT require a token.
router.post('/user/login', passport.authenticate('local', { session: false }), loginUser);

router.post('/user/:id', isLoggedIn, isAccountOwner, upload.single('image'), validateUserImage, verifyUser, updateUserInfo);

router.get('/user/:id', isLoggedIn, showUserInfo);

export default router;