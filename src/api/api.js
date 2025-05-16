// src/api/api.js
import axios from 'axios';

// ===========================
// Gestion du token global
// ===========================

let token = null;

// Permet de définir le token une fois connecté (login)
export function setToken(t) {
  token = t;
}

// =======================
// Création de l'instance Axios
// =======================

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // URL de base de l’API Laravel
  withCredentials: false // Pas de cookies CSRF, le backend est stateless
});

// ========================
// Intercepteur de requête
// ========================
// Ajoute automatiquement le token d’authentification aux requêtes sortantes
api.interceptors.request.use(config => {
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ========================
// Intercepteur de réponse
// ========================
// Uniformise les erreurs en extrayant le message utile de la réponse
api.interceptors.response.use(
  res => res, // en cas de succès, on renvoie la réponse inchangée
  err => {
    // Si erreur, on extrait un message clair à partir de la réponse
    const payload = err.response?.data || { message: err.message };
    return Promise.reject(payload);
  }
);

// ===========================
// Fonctions d’appel à l’API
// ===========================

// Authentification
export const login = async creds => {
  const { data } = await api.post('/login', creds);
  setToken(data.token); // on stocke le token JWT une fois connecté
  return data;
};

export const register = data => api.post('/register', data);
export const logout   = () => api.post('/logout');

// Histoires
export const getStories = () => api.get('/stories');

// Chapitres
export const getChapters       = sid         => api.get(`/stories/${sid}/chapters`);
export const getChapter        = (sid, cid)  => api.get(`/stories/${sid}/chapters/${cid}`);
export const getChapterByOrder = (sid, order)=> api.get(`/stories/${sid}/chapters/order/${order}`);
export const createChapter     = (sid, d)    => api.post(`/stories/${sid}/chapters`, d);

// On exporte l’instance Axios pour un usage personnalisé si nécessaire
export default api;