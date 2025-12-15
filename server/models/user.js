import mongoose from 'mongoose';
const Schema=mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose';

//Important: unique:true is an index hint
// not a validation rule. Mongoose won’t perform a synchronous uniqueness check
// race conditions can still produce duplicates unless the DB index exists and you handle duplicate-key errors (E11000).
const model=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})

//it will automatically add a name and password fiels with unique username
//passport local is an obj but plugin expect a func the deault in it is a func
model.plugin(passportLocalMongoose.default);
export default mongoose.model('User',model);