import express from 'express';
const router=express.Router();
import {isLoggedIn,isAuthor,verifyCampgrounds} from '../middleware.js';

import {loadUpdatePage, 
    updateCampground, deleteCampground, createNewCampground, 
    loadAllCampground, showOneCampground, 
    newCampPage} from '../controllers/campgrounds.js';

router.route('/')
    .get(loadAllCampground)
    .post(isLoggedIn,verifyCampgrounds,createNewCampground)  

router.get('/new',isLoggedIn,newCampPage)

router.route('/:id')
    .patch(isLoggedIn,isAuthor,verifyCampgrounds,updateCampground)
    .delete(isLoggedIn,isAuthor,deleteCampground)
    .get(showOneCampground)

router.get('/edit/:id',isLoggedIn,isAuthor,loadUpdatePage)

export default router;