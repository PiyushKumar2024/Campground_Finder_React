import express from 'express';
const router=express.Router();
import {isLoggedIn,isAuthor,verifyCampgrounds} from '../middleware.js';

import { updateCampground, deleteCampground, createNewCampground, 
        loadAllCampground, showOneCampground, } from '../controllers/campgrounds.js';

//the verification for page and author and page will be done on  the frontend    
router.route('/')
    .get(loadAllCampground)
    .post(isLoggedIn,verifyCampgrounds,createNewCampground)  

router.route('/:id')
    .patch(isLoggedIn,isAuthor,verifyCampgrounds,updateCampground)
    .delete(isLoggedIn,isAuthor,deleteCampground)
    .get(showOneCampground)

export default router;