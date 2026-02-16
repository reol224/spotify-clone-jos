import db from '../services/database.js';
import fs from 'fs';
import path from 'path';

export function streamTrack(req, res) {
  try {
    const track = db.prepare('SELECT * FROM tracks WHERE id = ?').get(req.params.id);
    
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    if (!fs.existsSync(track.file_path)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }
    
    const stat = fs.statSync(track.file_path);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    if (range) {
      // Handle range request for seeking
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(track.file_path, { start, end });
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': track.mime_type || 'audio/mpeg'
      });
      
      file.pipe(res);
    } else {
      // Stream entire file
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': track.mime_type || 'audio/mpeg'
      });
      
      fs.createReadStream(track.file_path).pipe(res);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export function getTrackCover(req, res) {
  try {
    const track = db.prepare('SELECT cover_art FROM tracks WHERE id = ?').get(req.params.id);
    
    if (!track || !track.cover_art) {
      return res.status(404).json({ error: 'Cover art not found' });
    }
    
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': track.cover_art.length
    });
    
    res.end(track.cover_art);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
