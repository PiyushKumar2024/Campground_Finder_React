import express from 'express';
import passport from 'passport';
import { registerUser, loginUser } from '../controllers/user.js';

const router=express.Router();

router.post('/register', registerUser);

// The 'local' strategy checks username/password in req.body. It does NOT require a token.
router.post('/login', (req, res, next) => {
    console.log('DEBUG: Login Route Hit with body:', req.body);
    next();
}, passport.authenticate('local', { session: false }), loginUser);

export default router;