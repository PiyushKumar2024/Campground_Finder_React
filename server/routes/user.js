import express from 'express';
import passport from 'passport';
import { registerUser, loginUser } from '../controllers/user.js';

const router=express.Router();

router.post('/register', registerUser);

//for jwt verification if passport.authenticate then it atteches the find user to the reeq body
router.post('/login', passport.authenticate('local', { session: false }), loginUser);

export default router;