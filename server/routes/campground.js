import express from 'express';
import multer from 'multer';
import {cloudinary,storage} from '../cloudinary/cloudinary.js'
import {isLoggedIn,isAuthor,verifyCampgrounds} from '../middlewares/middleware.js';
import { updateCampground, deleteCampground, createNewCampground, 
        loadAllCampground, showOneCampground, } from '../controllers/campgrounds.js';
import { validateImages } from '../middlewares/validateImages.js';        

const router=express.Router();
const upload=multer({storage});

//the verification for page and author and page will be done on  the frontend    
router.route('/')
    .get(loadAllCampground)
    .post(isLoggedIn,upload.array('image'),validateImages,verifyCampgrounds,createNewCampground)    

router.route('/:id')
    .patch(isLoggedIn,isAuthor,upload.array('image'),validateImages,verifyCampgrounds,updateCampground)
    .delete(isLoggedIn,isAuthor,deleteCampground)
    .get(showOneCampground)

export default router;