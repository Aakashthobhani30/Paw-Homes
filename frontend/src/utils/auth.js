import api from '../api';

const ACCESS_TOKEN = 'access';
const REFRESH_TOKEN = 'refresh';

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN);

export const setTokens = (access, refresh) => {
  localStorage.setItem(ACCESS_TOKEN, access);
  localStorage.setItem(REFRESH_TOKEN, refresh);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
};

export const refreshAccessToken = async () => {
  try {
    const refresh = getRefreshToken();
    if (!refresh) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/api/token/refresh/', {
      refresh: refresh
    });

    const { access } = response.data;
    localStorage.setItem(ACCESS_TOKEN, access);
    return access;
  } catch (error) {
    clearTokens();
    window.location.href = '/login';
    throw error;
  }
};

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        
        // Update the authorization header with the new token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
); 