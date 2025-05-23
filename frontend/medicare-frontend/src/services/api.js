import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Vite lo redirige a localhost:4000
});

export default api;
