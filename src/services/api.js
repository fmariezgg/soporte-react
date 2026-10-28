import axios from 'axios'

// The base URL can be overridden with VITE_API_URL.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
  timeout: 8000,
})
