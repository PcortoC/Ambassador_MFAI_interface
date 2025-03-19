import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Création de l'instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// Services des missions
export const missionService = {
  getAvailableMissions: () => api.get('/missions/available'),
  completeMission: (missionId, proof) => api.post(`/missions/${missionId}/complete`, { proof }),
};

// Services des ressources
export const resourceService = {
  getResources: () => api.get('/ressources'),
  getResource: (id) => api.get(`/ressources/${id}`),
  completeResource: (id) => api.post(`/ressources/${id}/complete`),
};

// Services des récompenses
export const rewardService = {
  getRewards: () => api.get('/recompenses'),
  claimReward: (id) => api.post(`/recompenses/${id}/claim`),
};

export default api; 