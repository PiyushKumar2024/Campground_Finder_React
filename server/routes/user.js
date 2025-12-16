import express from 'express';
import passport from 'passport';
import {storeReturnTo} from '../middleware.js';
import { showRegPage, registerUser, showLoginPage, loginUser, logoutUser } from '../controllers/user.js';

const router=express.Router();

router.route('/register')
    .get(showRegPage)
    .post(registerUser)

router.route('/login')
    .get(showLoginPage)
    .post(storeReturnTo,passport.authenticate('local'),loginUser)

router.get('/logout',logoutUser);

export default router;