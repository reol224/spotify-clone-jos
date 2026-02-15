// Simple in-memory music store (persisted to localStorage)
const STORAGE_KEY = 'vibestream_library';

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load music library from storage:', e);
  }
  return { songs: [], playlists: [] };
}

function saveToStorage(library) {
  try {
    // Don't store audio data or large blobs in localStorage
    const toStore = {
      songs: library.songs.map(s => ({
        ...s,
        audioUrl: undefined, // Don't persist blob URLs
        coverArt: s.coverArt && s.coverArt.startsWith('data:') ? s.coverArt : undefined,
      })),
      playlists: library.playlists,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch (e) {
    console.error('Failed to save music library to storage:', e);
  }
}

let library = loadFromStorage();
let listeners = [];

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
  library = {
    ...library,
    songs: [...library.songs, ...songs],
  };
  saveToStorage(library);
  notify();
}

export function removeSong(songId) {
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
