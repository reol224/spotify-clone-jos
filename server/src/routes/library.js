import express from 'express';
import multer from 'multer';
import { getAllTracks, getTrackById, addTrack, addTracks, deleteTrack, scanDirectory } from '../controllers/libraryController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Get all tracks
router.get('/tracks', getAllTracks);

// Get track by ID
router.get('/tracks/:id', getTrackById);

// Upload single track
router.post('/upload', upload.single('file'), addTrack);

// Bulk upload tracks
router.post('/upload-bulk', upload.array('files', 1000), addTracks);

// Delete track
router.delete('/tracks/:id', deleteTrack);

// Scan directory for music files
router.post('/scan', scanDirectory);

export default router;
