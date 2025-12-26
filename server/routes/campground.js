import express from 'express';
import multer from 'multer';
import {storage} from '../config/cloudinary.js'
import {isLoggedIn,isAuthor,verifyCampgrounds} from '../middlewares/middleware.js';
import { updateCampground, deleteCampground, createNewCampground, 
        loadAllCampground, showOneCampground, } from '../controllers/campgrounds.js';
import { validateImages } from '../middlewares/validateImages.js';        

const router=express.Router();
const upload=multer({
    storage,
    limits:{fileSize:5*1024*1024}, //cant upload greater than 5MB
    fileFilter:(req,file,cb)=>{ //check for mime type and then sends it
        if(!file.mimetype.startsWith('image/')){
            return cb(new Error('only images are allowed'),false);
        }
        cb(null,true);
    }
});

//the verification for page and author and page will be done on  the frontend    
router.route('/')
    .get(loadAllCampground)
    .post(isLoggedIn,upload.array('image'),validateImages,verifyCampgrounds,createNewCampground)    

router.route('/:id')
    .patch(isLoggedIn,isAuthor,upload.array('image'),validateImages,verifyCampgrounds,updateCampground)
    .delete(isLoggedIn,isAuthor,deleteCampground)
    .get(showOneCampground)

export default router;