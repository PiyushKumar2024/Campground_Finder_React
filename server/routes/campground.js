import express from 'express';
import multer from 'multer';
import {cloudinary,storage} from '../cloudinary/cloudinary.js'
import {isLoggedIn,isAuthor,verifyCampgrounds} from '../middlewares/middleware.js';
import { updateCampground, deleteCampground, createNewCampground, 
        loadAllCampground, showOneCampground, } from '../controllers/campgrounds.js';

const router=express.Router();
const upload=multer({storage});

//the verification for page and author and page will be done on  the frontend    
router.route('/')
    .get(loadAllCampground)
    .post(isLoggedIn,upload.array('image'),verifyCampgrounds,createNewCampground)    

router.route('/:id')
    .patch(isLoggedIn,isAuthor,verifyCampgrounds,updateCampground)
    .delete(isLoggedIn,isAuthor,deleteCampground)
    .get(showOneCampground)

export default router;