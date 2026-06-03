import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const pointSchema = new Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true //must be type 'Point' for mongo to use geo queries
    },
    coordinates: {
        type: [Number], //longitude than latitude
        required: true
    }
});
