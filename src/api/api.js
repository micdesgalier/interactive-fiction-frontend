import axios from 'axios';

let token = null;

// Permet de définir le token après le login
export function setToken(t) {
  token = t;
}

// Création de l'instance Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: false, // pas de cookies, purement stateless
});

// Ajout du token à chaque requête si présent
api.interceptors.request.use(config => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API

export const login = async creds => {
  const { data } = await api.post('/login', creds);
  setToken(data.token); // on sauvegarde le token globalement
  return data;
};

export const register = data => api.post('/register', data);
export const logout = () => api.post('/logout');

export const getStories = () => api.get('/stories');

export const getChapters = sid => api.get(`/stories/${sid}/chapters`);
export const getChapter = (sid, cid) => api.get(`/stories/${sid}/chapters/${cid}`);
export const getChapterByOrder = (sid, order) => api.get(`/stories/${sid}/chapters/order/${order}`);
export const createChapter = (sid, d) => api.post(`/stories/${sid}/chapters`, d);


export default api;