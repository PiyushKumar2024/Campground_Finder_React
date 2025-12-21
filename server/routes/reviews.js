import express from 'express';
const router=express.Router({mergeParams:true})
import {isLoggedIn,verifyReviews,isReviewAuthor} from '../middlewares/middleware.js';
import { createReview, deleteReview } from '../controllers/review.js';

router.post('/',isLoggedIn,verifyReviews,createReview)

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,deleteReview)

export default router;
