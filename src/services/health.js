const API_BASE_URL = '/api';

export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  } catch (error) {
    throw new Error('Server is not running');
  }
};
