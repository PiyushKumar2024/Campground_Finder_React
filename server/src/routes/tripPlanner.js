import express from 'express';
import { getTripInsights } from '../controllers/tripPlanner.js';
import { isLoggedIn } from '../middlewares/middleware.js';

const router = express.Router();

// Get AI Trip Insights (requires login so it's tied to a user session/limits if needed)
router.post('/insights', isLoggedIn, getTripInsights);

export default router;
