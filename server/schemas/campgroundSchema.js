import mongoose from "mongoose"
import { pointSchema } from "./pointSchema.js";
const Schema=mongoose.Schema;

export const campgrounds=new Schema({

     name:{
        type:String,
        required:true
     },

     price:{
        type:Number,
        required:true
     },

     description:{
        type:String,
        required:true
     },

     location:{
        type:String,
        required:true
     },
     campLocation:{ 
         type:pointSchema,
         required:true
      },
      image:{
         type:[
            {
                url:{
                    type:String,
                    required:true
                },
                imageId:{
                    type:String,
                    required:true
                }
            }
         ],
         required:true
     },

     //author will be singular but there can be many reviews
     author:{
        type:Schema.Types.ObjectId,
        ref:'User'
     },

     reviews:[{
         type:Schema.Types.ObjectId,
         ref:'Review'
     }]
 })
