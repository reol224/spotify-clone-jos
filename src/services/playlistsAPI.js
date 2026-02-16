const API_BASE_URL = '/api';

async function parseJsonResponse(response) {
  // Avoid crashing on empty responses (e.g. 204 No Content or misconfigured backend)
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON response (status ${response.status})`);
  }
}

async function requestJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Request failed: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`);
  }
  return parseJsonResponse(response);
}

export const playlistsAPI = {
  getAllPlaylists: async () => {
    const data = await requestJson(`${API_BASE_URL}/playlists`);
    return Array.isArray(data) ? data : [];
  },

  getPlaylistById: async (id) => {
    return requestJson(`${API_BASE_URL}/playlists/${id}`);
  },

  getPlaylistTracks: async (id) => {
    const data = await requestJson(`${API_BASE_URL}/playlists/${id}/tracks`);
    return Array.isArray(data) ? data : [];
  },

  createPlaylist: async (name, description = '') => {
    return requestJson(`${API_BASE_URL}/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
  },

  updatePlaylist: async (id, updates) => {
    return requestJson(`${API_BASE_URL}/playlists/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
  },

  deletePlaylist: async (id) => {
    return requestJson(`${API_BASE_URL}/playlists/${id}`, {
      method: 'DELETE'
    });
  },

  addTrackToPlaylist: async (playlistId, trackId) => {
    return requestJson(`${API_BASE_URL}/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackId })
    });
  },

  removeTrackFromPlaylist: async (playlistId, trackId) => {
    return requestJson(`${API_BASE_URL}/playlists/${playlistId}/tracks/${trackId}`, {
      method: 'DELETE'
    });
  }
};
