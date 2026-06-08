import express from 'express';
import { searchPlaces } from '../controllers/places.js';

const router = express.Router();

// Get AI-powered popular tourist destinations
router.get('/search', searchPlaces);

export default router;
