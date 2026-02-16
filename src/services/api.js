const API_BASE_URL = 'http://localhost:3001/api';

// Library API
export const libraryAPI = {
  getAllTracks: async () => {
    const response = await fetch(`${API_BASE_URL}/library/tracks`);
    return response.json();
  },

  getTrackById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/library/tracks/${id}`);
    return response.json();
  },

  uploadTrack: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/library/upload`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  },

  deleteTrack: async (id) => {
    const response = await fetch(`${API_BASE_URL}/library/tracks/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  getStreamUrl: (id) => `${API_BASE_URL}/stream/${id}`,
  
  getCoverUrl: (id) => `${API_BASE_URL}/stream/${id}/cover`
};

// Playlists API
export const playlistsAPI = {
  getAllPlaylists: async () => {
    const response = await fetch(`${API_BASE_URL}/playlists`);
    return response.json();
  },

  getPlaylistById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/playlists/${id}`);
    return response.json();
  },

  getPlaylistTracks: async (id) => {
    const response = await fetch(`${API_BASE_URL}/playlists/${id}/tracks`);
    return response.json();
  },

  createPlaylist: async (name, description = '') => {
    const response = await fetch(`${API_BASE_URL}/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    return response.json();
  },

  updatePlaylist: async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/playlists/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  },

  deletePlaylist: async (id) => {
    const response = await fetch(`${API_BASE_URL}/playlists/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  addTrackToPlaylist: async (playlistId, trackId) => {
    const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackId })
    });
    return response.json();
  },

  removeTrackFromPlaylist: async (playlistId, trackId) => {
    const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/tracks/${trackId}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

// Health check
export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  } catch (error) {
    throw new Error('Server is not running');
  }
};
