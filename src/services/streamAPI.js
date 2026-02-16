const API_BASE_URL = '/api';

export const streamAPI = {
  getStreamUrl: (id) => `${API_BASE_URL}/stream/${id}`,
  
  getCoverUrl: (id) => `${API_BASE_URL}/stream/${id}/cover`,
  
  streamTrack: async (id) => {
    const response = await fetch(`${API_BASE_URL}/stream/${id}`);
    return response.blob();
  },
  
  getTrackCover: async (id) => {
    const response = await fetch(`${API_BASE_URL}/stream/${id}/cover`);
    return response.blob();
  }
};
