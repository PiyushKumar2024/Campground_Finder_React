import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from './models/user.js';
import dotenv from 'dotenv';

dotenv.config();
const JWTSECRET=process.env.JWT_SECRET || 'thisshouldbeaprodsecret';


const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:JWTSECRET
};

// Separate verification function
const jwtVerify = async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (err) {
        return done(err, false);
    }
};

export default (passport) => {
    passport.use(new JwtStrategy(options, jwtVerify));
};