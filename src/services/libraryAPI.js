const API_BASE_URL = '/api';

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

  uploadTracks: async (files, onProgress) => {
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Upload failed'));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });
      
      xhr.open('POST', `${API_BASE_URL}/library/upload-bulk`);
      xhr.send(formData);
    });
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
