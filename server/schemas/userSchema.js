import mongoose from 'mongoose';
import { pointSchema } from './pointSchema.js';
const Schema = mongoose.Schema;

export const user = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    geometry: {
        type: pointSchema,
        required: false
    }
});


//Important: unique:true is an index hint
// not a validation rule. Mongoose won’t perform a synchronous uniqueness check
// race conditions can still produce duplicates unless the DB index exists and you handle duplicate-key errors (E11000).