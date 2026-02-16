import express from 'express';
import {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  getPlaylistTracks
} from '../controllers/playlistController.js';

const router = express.Router();

// Get all playlists
router.get('/', getAllPlaylists);

// Get playlist by ID
router.get('/:id', getPlaylistById);

// Get playlist tracks
router.get('/:id/tracks', getPlaylistTracks);

// Create new playlist
router.post('/', createPlaylist);

// Update playlist
router.put('/:id', updatePlaylist);

// Delete playlist
router.delete('/:id', deletePlaylist);

// Add track to playlist
router.post('/:id/tracks', addTrackToPlaylist);

// Remove track from playlist
router.delete('/:id/tracks/:trackId', removeTrackFromPlaylist);

export default router;
