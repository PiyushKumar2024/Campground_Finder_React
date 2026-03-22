import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import {user} from '../schemas/userSchema.js';

//it will automatically add a name and password fiels with unique username
//passport local is an obj but plugin expect a func the deault in it is a func
user.plugin(passportLocalMongoose.default);
export default mongoose.model('User', user);
