import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import campgroundsRoutes from './routes/campground.js';
import reviewsRoutes from './routes/reviews.js';
import authenticationRoutes from './routes/user.js';
import dotenv from 'dotenv';
import passport from 'passport';
import configureJwtStrategy from './passport.js';
import User from './models/user.js';
import { Strategy as LocalStrategy} from 'passport-local';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
dotenv.config();

const PORT=process.env.PORT || 3000;
const MONGOURL=process.env.MONGO_URL;

// Debugging Middleware: Log every request to see if it reaches the server
app.use((req, res, next) => {
    console.log(`DEBUG: Incoming Request ${req.method} ${req.url}`);
    next();
});

mongoose.connect(MONGOURL)
    .then(() => {
        console.log('successfully connected with mongodb')
        console.log('yay')
    })
    .catch(err => {
        console.log('error in connection')
        console.log(err)
    })

app.use(cors());
app.use(express.urlencoded({extended:true})) //for api works
app.use(express.json()) //also for parsing reqbody and working with json data
app.use(passport.initialize());//initi passport and also add its method to req body
passport.use(new LocalStrategy(User.authenticate()));//local->auth using username and pass .auth is from pass-lol-mon plugin
configureJwtStrategy(passport);//use the jwt stratergy in passport.js for autho

//setting up routes
app.use('/campgrounds',campgroundsRoutes)
app.use('/campgrounds/:id/reviews',reviewsRoutes)
app.use('/',authenticationRoutes)

app.listen(PORT, () => {
    console.log('listening on port 3000')
})

//error handling middleware (have an extra err signature) also handles the catchasync
app.use((err,req,res,next)=>{
    //default message and status code
    if(!err.message) err.message='Something went wrong'
    if(!err.status) err.status=500
    console.log(err)
    // Return a JSON response for errors
    res.status(err.status).json({ message: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
})
