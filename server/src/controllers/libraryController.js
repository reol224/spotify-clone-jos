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

export async function addTracks(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const results = [];
    const errors = [];
    
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      try {
        const filePath = file.path;
        const metadata = await parseFile(filePath);
        
        const trackId = randomUUID();
        
        // Convert cover art to base64 if present
        let coverArtBase64 = null;
        if (metadata.common.picture?.[0]?.data) {
          coverArtBase64 = `data:${metadata.common.picture[0].format};base64,${metadata.common.picture[0].data.toString('base64')}`;
        }
        
        const track = {
          id: trackId,
          title: metadata.common.title || path.basename(file.originalname, path.extname(file.originalname)),
          artist: metadata.common.artist || 'Unknown Artist',
          album: metadata.common.album || 'Unknown Album',
          duration: metadata.format.duration ? Math.floor(metadata.format.duration) : 0,
          file_path: filePath,
          file_size: file.size,
          mime_type: metadata.format.codec || file.mimetype,
          cover_art: coverArtBase64,
          year: metadata.common.year || null,
          genre: metadata.common.genre?.[0] || null,
          track_number: metadata.common.track?.no || null,
          disc_number: metadata.common.disk?.no || null,
          file_name: file.originalname,
          file_type: file.mimetype,
          added_at: new Date().toISOString(),
          is_favorite: false
        };

        const stmt = db.prepare(`
          INSERT INTO tracks (id, title, artist, album, duration, file_path, file_size, mime_type, cover_art, year, genre, track_number, disc_number)
          VALUES (@id, @title, @artist, @album, @duration, @file_path, @file_size, @mime_type, @cover_art, @year, @genre, @track_number, @disc_number)
        `);
        
        stmt.run(track);
        
        // Return a clean version of the track for the frontend
        results.push({
          id: track.id,
          title: track.title,
          artist: track.artist,
          album: track.album,
          duration: track.duration,
          coverArt: track.cover_art,
          year: track.year,
          genre: track.genre,
          trackNumber: track.track_number,
          fileName: track.file_name,
          fileSize: track.file_size,
          fileType: track.file_type,
          addedAt: track.added_at,
          isFavorite: track.is_favorite
        });
      } catch (error) {
        errors.push({ file: file.originalname, error: error.message });
      }
    }
    
    res.status(201).json({ 
      success: true,
      message: `Successfully imported ${results.length} track${results.length !== 1 ? 's' : ''}`,
      imported: results.length,
      total: req.files.length,
      tracks: results,
      errors: errors.length > 0 ? errors : undefined
    });
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
