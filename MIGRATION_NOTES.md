# Backend Migration Notes

## What Changed: Frontend → Backend Processing

### Summary
All heavy audio processing (metadata parsing, ID3 tag extraction, cover art processing), playlist management, and audio streaming have been moved from the frontend to the backend server.

---

## Backend Changes

### New Endpoint: `/api/library/upload-bulk`
- Accepts multiple audio files via `multipart/form-data`
- Processes each file server-side using `music-metadata` library
- Extracts:
  - Title, Artist, Album
  - Year, Genre, Track Number, Disc Number
  - Duration
  - Cover Art (converted to base64 data URLs)
- Returns processed metadata to frontend
- Saves files to `uploads/` directory
- Stores metadata in SQLite database

### Updated Files:
1. **`server/src/routes/library.js`**
   - Added `upload-bulk` route with `multer` array upload (max 1000 files)
   - Imports new `addTracks` controller

2. **`server/src/controllers/libraryController.js`**
   - Added `addTracks()` function for bulk processing
   - Handles metadata extraction with `music-metadata.parseFile()`
   - Converts cover art Buffer to base64 data URL
   - Returns clean JSON response with all track data

3. **`server/src/index.js`**
   - Auto-creates `uploads/` directory on startup
   - Added file system utilities for directory management

---

## Playlists - Now Backend-Managed

### Endpoints:
- `GET /api/playlists` - Get all playlists
- `GET /api/playlists/:id` - Get playlist by ID
- `GET /api/playlists/:id/tracks` - Get tracks in playlist
- `POST /api/playlists` - Create new playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/tracks` - Add track to playlist
- `DELETE /api/playlists/:id/tracks/:trackId` - Remove track from playlist

### Backend Already Implemented:
- `server/src/routes/playlists.js` - Playlist routing
- `server/src/controllers/playlistController.js` - All CRUD operations
- SQLite database with `playlists` and `playlist_tracks` tables

### Frontend Changes:
1. **`src/components/Playlists.jsx`**
   - Now fetches playlists from backend via `playlistsAPI`
   - Real-time loading state
   - Replaced localStorage-based state with server state

2. **`src/components/PlaylistView.jsx`**
   - Now loads playlist data and tracks from backend
   - Remove/add operations update backend first
   - Replaced `musicStore` subscription with API calls

### What's NO LONGER Used for Playlists:
- ❌ `musicStore.createPlaylist()` - use backend API
- ❌ `musicStore.deletePlaylist()` - use backend API
- ❌ `musicStore.addSongToPlaylist()` - use backend API
- ❌ `musicStore.removeSongFromPlaylist()` - use backend API
- ❌ `musicStore.getSongsForPlaylist()` - use backend API

---

## Streaming - Now Backend-Served

### Endpoints:
- `GET /api/stream/:id` - Stream audio file with range request support
- `GET /api/stream/:id/cover` - Get track cover art

### Features:
- **Range requests**: Allows seeking/fast-forwarding without downloading entire file
- **Proper MIME types**: Sets correct Content-Type headers
- **Efficient streaming**: Uses Node.js streams for memory efficiency
- **Cover art**: Stored as base64 in database, served directly from stream endpoint

### Backend Already Implemented:
- `server/src/routes/stream.js` - Stream routing
- `server/src/controllers/streamController.js` - Streaming logic with range support

### Frontend Changes:
1. **`src/services/api.js`**
   - Added `streamAPI` object with helper functions
   - `getStreamUrl()` - returns the direct stream URL for audio player
   - `getCoverUrl()` - returns the cover art URL
   - `streamTrack()` - fetch audio blob programmatically
   - `getTrackCover()` - fetch cover art blob

2. **Player Components**
   - Use `streamAPI.getStreamUrl(trackId)` as `<audio>` source
   - No more local blob URLs or IndexedDB audio retrieval
   - All audio served from backend

### What's NO LONGER Used for Streaming:
- ❌ `musicStore.audioUrl` - replaced with stream endpoint
- ❌ `indexedDBStore.getAudioBlob()` - files served from backend
- ❌ Local blob URL creation - use direct stream URLs

---

## Frontend Changes

### Updated Files:

1. **`src/services/api.js`**
   - Added `libraryAPI.uploadTracks()` function
   - Uses XMLHttpRequest for upload progress tracking
   - Sends files to `/api/library/upload-bulk`
   - Returns promise with parsed track data
   - **NEW**: Added `streamAPI` object with streaming helpers

2. **`src/components/ImportMusic.jsx`**
   - Removed dependency on `parseAudioFiles` from `audioParser.js`
   - Now calls `libraryAPI.uploadTracks()` instead
   - Files are sent to backend for processing
   - Upload progress shown during file transfer
   - Receives fully parsed metadata from backend response

3. **`src/components/Playlists.jsx`**
   - Fetches from backend API instead of localStorage
   - Real-time loading states

4. **`src/components/PlaylistView.jsx`**
   - Loads playlist and tracks from backend
   - All mutations go through API

### What's NO LONGER Used Client-Side:
- ❌ `parseAudioFiles()` - moved to backend
- ❌ `parseAudioFile()` - moved to backend
- ❌ `parseID3v2()` - moved to backend
- ❌ `decodeTextFrame()` - moved to backend
- ❌ `decodeAPICFrame()` - moved to backend
- ❌ `getAudioDuration()` - moved to backend

**Note**: The `src/utils/audioParser.js` file still exists but is no longer used in the import flow. It can be removed or kept as a fallback.

---

## Benefits

✅ **Lighter frontend**: No more heavy ID3 parsing or blob management in browser  
✅ **Better performance**: Server has more resources for parsing and streaming  
✅ **Faster UI**: File upload is async, UI stays responsive  
✅ **Centralized logic**: All parsing logic in one place (backend)  
✅ **Better error handling**: Server can handle corrupt files gracefully  
✅ **Scalable**: Easy to add more audio formats or metadata sources  
✅ **Better playlist management**: Playlists persist in database  
✅ **Efficient streaming**: Range requests for seeking support  
✅ **No IndexedDB overhead**: Audio served directly from backend  

---

## How to Test

1. **Start the backend server:**
   ```bash
   cd server
   npm start
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

3. **Test playlists:**
   - Navigate to Library → Playlists
   - Playlists load from backend
   - Click playlist to view tracks
   - Remove tracks - updates backend

4. **Test streaming:**
   - Play any track from library
   - Audio streams from backend
   - Seek/fast-forward works seamlessly

5. **Import music files:**
   - Click "Import Music" in the app
   - Select or drag-and-drop audio files
   - Watch the upload progress
   - Backend will parse metadata automatically
   - Tracks appear with full metadata (title, artist, album, cover art, etc.)

---

## Technical Details

### Architecture

**Before (Client-side Heavy):**
```
Import → Parse ID3 (client) → Store IndexedDB (client) → Play (from IndexedDB)
Playlist → Create (localStorage) → Manage (in-memory) → No persistence
Stream → Serve from blob URL (no seeking support)
```

**After (Server-side Heavy):**
```
Import → Upload → Parse ID3 (server) → Store in DB → Stream from server
Playlist → API call → Store in DB → CRUD via API → Full persistence
Stream → Range-request enabled streaming → Efficient seeking
```

### Metadata Parsing Libraries

- **Frontend (old)**: Custom ID3v2 parser in JavaScript
- **Backend (new)**: [`music-metadata`](https://www.npmjs.com/package/music-metadata) - industry standard, supports more formats

### Supported Audio Formats

Both approaches support: MP3, M4A, FLAC, WAV, OGG, AAC, OPUS, WMA, WebM

---

## Next Steps (Optional Improvements)

- [ ] Add WebSocket events for real-time playlist updates across clients
- [ ] Implement chunked file uploads for very large files
- [ ] Add audio transcoding for unsupported formats
- [ ] Implement server-side duplicate detection
- [ ] Add lyrics extraction
- [ ] Generate audio waveforms server-side
- [ ] Add playlist sharing/collaboration features
- [ ] Implement user authentication per playlist
- [ ] Add rate limiting for uploads
