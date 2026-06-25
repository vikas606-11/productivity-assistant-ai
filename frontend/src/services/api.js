/**
 * api.js — Axios HTTP client (placeholder).
 * Full API service methods will be implemented in Commit #2.
 */
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (auth tokens will be attached here later)
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

// Response interceptor (global error handling will go here)
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default api
