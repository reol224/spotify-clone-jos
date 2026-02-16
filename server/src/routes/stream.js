import express from 'express';
import { streamTrack, getTrackCover } from '../controllers/streamController.js';

const router = express.Router();

// Stream audio file
router.get('/:id', streamTrack);

// Get track cover art
router.get('/:id/cover', getTrackCover);

export default router;
