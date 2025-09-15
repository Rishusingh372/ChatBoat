import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
}

export const chatAPI = {
  sendMessage: (message) => api.post('/message', { text: message }),
  getChatHistory: () => api.get('/chat/history'),
}

export default api