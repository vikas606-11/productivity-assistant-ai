import axios from 'axios';

// Axios instance configured for Vite local proxying
const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  getAll: async () => {
    const response = await api.get('/api/tasks');
    return response.data;
  },
  get: async (id) => {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  },
  create: async (taskData) => {
    const response = await api.post('/api/tasks', taskData);
    return response.data;
  },
  update: async (id, taskData) => {
    const response = await api.put(`/api/tasks/${id}`, taskData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  },
  complete: async (id) => {
    const response = await api.patch(`/api/tasks/${id}/complete`);
    return response.data;
  },
  search: async (params = {}) => {
    const response = await api.get('/api/search', { params });
    return response.data;
  },
  getTags: async () => {
    const response = await api.get('/api/tags');
    return response.data;
  },
  suggestTags: async (title, description = '') => {
    const response = await api.get('/api/tasks/suggest-tags', {
      params: { title, description }
    });
    return response.data;
  },
  getSummary: async (forceRefresh = false) => {
    const response = await api.get('/api/summary', {
      params: { refresh: forceRefresh }
    });
    return response.data;
  },
};

export const noteService = {
  getAll: async () => {
    const response = await api.get('/api/notes');
    return response.data;
  },
  get: async (id) => {
    const response = await api.get(`/api/notes/${id}`);
    return response.data;
  },
  create: async (noteData) => {
    const response = await api.post('/api/notes', noteData);
    return response.data;
  },
  update: async (id, noteData) => {
    const response = await api.put(`/api/notes/${id}`, noteData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/notes/${id}`);
    return response.data;
  },
};

export const aiService = {
  capture: async (text) => {
    const response = await api.post('/api/capture', { text });
    return response.data;
  },
};

export default api;
