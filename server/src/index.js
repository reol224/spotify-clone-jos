import express from 'express';
import cors from 'cors';
import { initDatabase } from './services/database.js';
import libraryRoutes from './routes/library.js';
import playlistRoutes from './routes/playlists.js';
import streamRoutes from './routes/stream.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDatabase();

// Routes
app.use('/api/library', libraryRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/stream', streamRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Music server running' });
});

app.listen(PORT, () => {
  console.log(`🎵 Music server running on http://localhost:${PORT}`);
});
