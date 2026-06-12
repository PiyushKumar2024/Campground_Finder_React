/**
 * @file tripPlanner.js
 * @description Express routes for the AI Smart Trip Planner.
 */
import express from 'express';
import { getTripInsights } from '../controllers/tripPlanner.js';
import { isLoggedIn } from '../middlewares/middleware.js';

const router = express.Router();

/**
 * @route POST /api/trip/insights
 * @description Fetch AI-generated trip itinerary and insights
 * @access Protected (Requires Login to manage API usage/limits)
 */
router.post('/insights', isLoggedIn, getTripInsights);

export default router;
