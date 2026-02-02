import mongoose from "mongoose";
const Schema=mongoose.Schema;

export const review = new Schema({
    date: {
        type: Date,
        default:Date.now
    },
    body: { type: String },
    rating: { type: Number },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
     }
})