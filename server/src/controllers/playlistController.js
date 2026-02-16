import db from '../services/database.js';
import { randomUUID } from 'crypto';

export function getAllPlaylists(req, res) {
  try {
    const playlists = db.prepare(`
      SELECT p.*, COUNT(pt.track_id) as track_count
      FROM playlists p
      LEFT JOIN playlist_tracks pt ON p.id = pt.playlist_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `).all();
    
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export function getPlaylistById(req, res) {
  try {
    const playlist = db.prepare('SELECT * FROM playlists WHERE id = ?').get(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export function getPlaylistTracks(req, res) {
  try {
    const tracks = db.prepare(`
      SELECT t.*, pt.position, pt.added_at
      FROM tracks t
      JOIN playlist_tracks pt ON t.id = pt.track_id
      WHERE pt.playlist_id = ?
      ORDER BY pt.position
    `).all(req.params.id);
    
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export function createPlaylist(req, res) {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Playlist name required' });
    }
    
    const playlistId = randomUUID();
    
    const stmt = db.prepare(`
      INSERT INTO playlists (id, name, description)
      VALUES (?, ?, ?)
    `);
    
    stmt.run(playlistId, name, description || null);
    
    const playlist = db.prepare('SELECT * FROM playlists WHERE id = ?').get(playlistId);
    
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export function updatePlaylist(req, res) {
  try {
    const { name, description } = req.body;
    const playlistId = req.params.id;
    
    const playlist = db.prepare('SELECT * FROM playlists WHERE id = ?').get(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    const stmt = db.prepare(`
      UPDATE playlists 
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(name, description, playlistId);
    
    const updated = db.prepare('SELECT * FROM playlists WHERE id = ?').get(playlistId);
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export function deletePlaylist(req, res) {
  try {
    const result = db.prepare('DELETE FROM playlists WHERE id = ?').run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export function addTrackToPlaylist(req, res) {
  try {
    const { trackId } = req.body;
    const playlistId = req.params.id;
    
    if (!trackId) {
      return res.status(400).json({ error: 'Track ID required' });
    }
    
    // Check if playlist exists
    const playlist = db.prepare('SELECT * FROM playlists WHERE id = ?').get(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    // Check if track exists
    const track = db.prepare('SELECT * FROM tracks WHERE id = ?').get(trackId);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    // Get next position
    const maxPosition = db.prepare('SELECT MAX(position) as max FROM playlist_tracks WHERE playlist_id = ?').get(playlistId);
    const position = (maxPosition?.max || 0) + 1;
    
    // Add track to playlist
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO playlist_tracks (playlist_id, track_id, position)
      VALUES (?, ?, ?)
    `);
    
    stmt.run(playlistId, trackId, position);
    
    res.status(201).json({ message: 'Track added to playlist', position });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export function removeTrackFromPlaylist(req, res) {
  try {
    const { id: playlistId, trackId } = req.params;
    
    const result = db.prepare('DELETE FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?').run(playlistId, trackId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Track not found in playlist' });
    }
    
    // Reorder positions
    db.prepare(`
      UPDATE playlist_tracks
      SET position = (
        SELECT COUNT(*) 
        FROM playlist_tracks pt2 
        WHERE pt2.playlist_id = playlist_tracks.playlist_id 
        AND pt2.added_at <= playlist_tracks.added_at
      )
      WHERE playlist_id = ?
    `).run(playlistId);
    
    res.json({ message: 'Track removed from playlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
