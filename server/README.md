# Self-Hosted Music Server

A lightweight Node.js backend for your offline music player.

## Features

- 🎵 Local music library management
- 📁 File upload with metadata extraction (ID3 tags)
- 🎨 Album art extraction and serving
- 📝 Playlist management (CRUD operations)
- 🔊 Audio streaming with range request support
- 💾 SQLite database for fast metadata queries

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### Library

- `GET /api/library/tracks` - Get all tracks
- `GET /api/library/tracks/:id` - Get track by ID
- `POST /api/library/upload` - Upload a music file
- `DELETE /api/library/tracks/:id` - Delete a track
- `POST /api/library/scan` - Scan directory (coming soon)

### Playlists

- `GET /api/playlists` - Get all playlists
- `GET /api/playlists/:id` - Get playlist details
- `GET /api/playlists/:id/tracks` - Get tracks in playlist
- `POST /api/playlists` - Create new playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/tracks` - Add track to playlist
- `DELETE /api/playlists/:id/tracks/:trackId` - Remove track from playlist

### Streaming

- `GET /api/stream/:id` - Stream audio file (supports range requests)
- `GET /api/stream/:id/cover` - Get album art

## Database

SQLite database stored in `data/music.db`

Tables:
- `tracks` - Music files with metadata
- `playlists` - User-created playlists
- `playlist_tracks` - Junction table for playlist-track relationships
