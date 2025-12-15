import mongooose from 'mongoose';
import User from './user.js';
const Schema = mongooose.Schema

const review = new Schema({
    // name: {
    //     type: String,
    //     required: true
    // },
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

export default mongooose.model('Review', review);