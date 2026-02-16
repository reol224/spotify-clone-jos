import db from '../services/database.js';
import { parseFile } from 'music-metadata';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export async function getAllTracks(req, res) {
  try {
    const tracks = db.prepare('SELECT * FROM tracks ORDER BY artist, album, track_number').all();
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getTrackById(req, res) {
  try {
    const track = db.prepare('SELECT * FROM tracks WHERE id = ?').get(req.params.id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.json(track);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function addTrack(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const metadata = await parseFile(filePath);
    
    const trackId = randomUUID();
    const track = {
      id: trackId,
      title: metadata.common.title || path.basename(req.file.originalname, path.extname(req.file.originalname)),
      artist: metadata.common.artist || 'Unknown Artist',
      album: metadata.common.album || 'Unknown Album',
      duration: metadata.format.duration ? Math.floor(metadata.format.duration) : 0,
      file_path: filePath,
      file_size: req.file.size,
      mime_type: metadata.format.codec || req.file.mimetype,
      cover_art: metadata.common.picture?.[0]?.data || null,
      year: metadata.common.year || null,
      genre: metadata.common.genre?.[0] || null,
      track_number: metadata.common.track?.no || null,
      disc_number: metadata.common.disk?.no || null
    };

    const stmt = db.prepare(`
      INSERT INTO tracks (id, title, artist, album, duration, file_path, file_size, mime_type, cover_art, year, genre, track_number, disc_number)
      VALUES (@id, @title, @artist, @album, @duration, @file_path, @file_size, @mime_type, @cover_art, @year, @genre, @track_number, @disc_number)
    `);
    
    stmt.run(track);
    
    res.status(201).json({ id: trackId, message: 'Track added successfully', track });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteTrack(req, res) {
  try {
    const track = db.prepare('SELECT * FROM tracks WHERE id = ?').get(req.params.id);
    
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    // Delete file
    try {
      await fs.unlink(track.file_path);
    } catch (err) {
      console.error('Failed to delete file:', err);
    }

    // Delete from database
    db.prepare('DELETE FROM tracks WHERE id = ?').run(req.params.id);
    
    res.json({ message: 'Track deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function scanDirectory(req, res) {
  try {
    const { directory } = req.body;
    
    if (!directory) {
      return res.status(400).json({ error: 'Directory path required' });
    }

    // This would scan a directory and import all music files
    // Implementation depends on whether this runs server-side or client-side
    res.json({ message: 'Directory scanning not yet implemented', directory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
