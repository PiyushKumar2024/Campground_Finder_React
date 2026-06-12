/**
 * @file passport.js
 * @description Configuration for Passport.js authentication strategies.
 * Defines the JWT strategy used for stateless API authentication across protected routes.
 */
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
    console.error('CRITICAL ERROR: JWT_SECRET is not defined in .env file. Server cannot start without it.');
    process.exit(1);
}

const JWTSECRET = process.env.JWT_SECRET;

/**
 * JWT Strategy Options
 * Extracts the JWT from the 'Authorization: Bearer <token>' header
 */
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWTSECRET
};

/**
 * JWT Verification Callback
 * @param {Object} jwt_payload - The decoded JWT payload
 * @param {Function} done - Passport callback (err, user)
 */
const jwtVerify = async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
            return done(null, user); // User found, authenticated successfully
        }
        return done(null, false); // User not found, unauthorized
    } catch (err) {
        return done(err, false); // Database or other error
    }
};

/**
 * Configure Passport to use the JWT strategy
 * @param {Object} passport - The Passport.js instance from the main app
 */
export default (passport) => {
    passport.use(new JwtStrategy(options, jwtVerify));
};