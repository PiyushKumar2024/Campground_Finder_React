/**
 * @file places.js
 * @description Express routes for the AI-powered tourist places search.
 */
import express from 'express';
import { searchPlaces } from '../controllers/places.js';

const router = express.Router();

/**
 * @route GET /api/places/search
 * @description Fetch AI-generated popular tourist destinations based on a query
 * @access Public
 */
router.get('/search', searchPlaces);

export default router;
