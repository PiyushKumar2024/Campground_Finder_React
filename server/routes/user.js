import express from 'express';
const router=express.Router();
import passport from 'passport';
import {storeReturnTo} from '../middleware.js';
import { showRegPage, registerUser, showLoginPage, loginUser, logoutUser } from '../controllers/user.js';

router.route('/register')
    .get(showRegPage)
    .post(registerUser)

router.route('/login')
    .get(showLoginPage)
    .post(storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),loginUser)

router.get('/logout',logoutUser);

export default router;