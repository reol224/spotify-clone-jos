// Simple in-memory music store (metadata in localStorage, audio blobs in IndexedDB)
import { saveAudioBlob, getAudioBlob, deleteAudioBlob } from './indexedDBStore.js';

const STORAGE_KEY = 'vibestream_library';

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Songs loaded from localStorage won't have audioUrl yet.
      // Audio blobs will be restored from IndexedDB asynchronously via initializeAudio().
      // Also handle legacy base64 data for migration.
      const songs = parsed.songs.map(song => {
        if (song.audioBase64) {
          // Legacy: reconstruct blob URL from base64, then migrate to IndexedDB
          const binaryString = atob(song.audioBase64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: song.audioMimeType || 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(blob);
          // Migrate to IndexedDB in background
          saveAudioBlob(song.id, blob, song.audioMimeType || 'audio/mpeg').then(() => {
            console.log('Migrated audio to IndexedDB:', song.title);
          });
          return {
            ...song,
            audioUrl,
            audioBase64: undefined, // Clear legacy base64
          };
        }
        return song;
      });
      return { ...parsed, songs };
    }
  } catch (e) {
    console.error('Failed to load music library from storage:', e);
  }
  return { songs: [], playlists: [] };
}

function saveToStorage(lib) {
  try {
    const toStore = {
      songs: lib.songs.map(s => ({
        ...s,
        audioUrl: undefined, // Don't persist blob URLs
        audioBase64: undefined, // No longer storing base64 in localStorage
        file: undefined,
        coverArt: s.coverArt && s.coverArt.startsWith('data:') ? s.coverArt : undefined,
      })),
      playlists: lib.playlists,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch (e) {
    console.error('Failed to save music library to storage:', e);
  }
}

let library = loadFromStorage();
let listeners = [];
let audioInitialized = false;

// Restore audio blob URLs from IndexedDB for songs that don't have them yet
async function initializeAudio() {
  if (audioInitialized) return;
  audioInitialized = true;
  
  let changed = false;
  const updatedSongs = await Promise.all(
    library.songs.map(async (song) => {
      if (song.audioUrl) return song; // Already has a URL (e.g. from legacy migration)
      
      const record = await getAudioBlob(song.id);
      if (record && record.blob) {
        const url = URL.createObjectURL(record.blob);
        changed = true;
        return { ...song, audioUrl: url, audioMimeType: record.mimeType };
      }
      return song;
    })
  );
  
  if (changed) {
    library = { ...library, songs: updatedSongs };
    notify();
  }
}

// Start loading audio from IndexedDB immediately
initializeAudio();

export function getLibrary() {
  return library;
}

export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

function notify() {
  listeners.forEach(l => l(library));
}

export function addSongs(songs) {
  // Process songs: create blob URLs and store blobs in IndexedDB
  const processedSongs = songs.map(song => {
    if (song.file) {
      const file = song.file;
      const audioUrl = URL.createObjectURL(file);
      const mimeType = file.type || 'audio/mpeg';
      
      // Store the audio blob in IndexedDB for persistence
      saveAudioBlob(song.id, file, mimeType).then(() => {
        console.log('Audio saved to IndexedDB:', song.title);
      }).catch(err => {
        console.error('Failed to save audio to IndexedDB:', err);
      });
      
      return {
        ...song,
        audioUrl,
        audioMimeType: mimeType,
        file: undefined, // Don't store the file object in memory
      };
    }
    return song;
  });
  
  library = {
    ...library,
    songs: [...library.songs, ...processedSongs],
  };
  saveToStorage(library);
  notify();
}

export function removeSong(songId) {
  // Remove audio blob from IndexedDB
  deleteAudioBlob(songId).catch(err => {
    console.error('Failed to delete audio blob:', err);
  });
  
  library = {
    ...library,
    songs: library.songs.filter(s => s.id !== songId),
    playlists: library.playlists.map(p => ({
      ...p,
      songIds: p.songIds.filter(id => id !== songId),
    })),
  };
  saveToStorage(library);
  notify();
}

export function createPlaylist(name, songIds = []) {
  const playlist = {
    id: 'pl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    name,
    songIds,
    createdAt: new Date().toISOString(),
    coverArt: null,
  };
  library = {
    ...library,
    playlists: [...library.playlists, playlist],
  };
  saveToStorage(library);
  notify();
  return playlist;
}

export function deletePlaylist(playlistId) {
  library = {
    ...library,
    playlists: library.playlists.filter(p => p.id !== playlistId),
  };
  saveToStorage(library);
  notify();
}

export function addSongToPlaylist(playlistId, songId) {
  library = {
    ...library,
    playlists: library.playlists.map(p =>
      p.id === playlistId && !p.songIds.includes(songId)
        ? { ...p, songIds: [...p.songIds, songId] }
        : p
    ),
  };
  saveToStorage(library);
  notify();
}

export function removeSongFromPlaylist(playlistId, songId) {
  library = {
    ...library,
    playlists: library.playlists.map(p =>
      p.id === playlistId
        ? { ...p, songIds: p.songIds.filter(id => id !== songId) }
        : p
    ),
  };
  saveToStorage(library);
  notify();
}

export function getSongsForPlaylist(playlistId) {
  const playlist = library.playlists.find(p => p.id === playlistId);
  if (!playlist) return [];
  return playlist.songIds
    .map(id => library.songs.find(s => s.id === id))
    .filter(Boolean);
}

// Favorites management
export function toggleFavorite(songId) {
  library = {
    ...library,
    songs: library.songs.map(s =>
      s.id === songId ? { ...s, isFavorite: !s.isFavorite } : s
    ),
  };
  saveToStorage(library);
  notify();
}

export function getFavoriteSongs() {
  return library.songs.filter(s => s.isFavorite);
}
