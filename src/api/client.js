import axios from 'axios'

// In dev, requests go through the Vite proxy at /api (see vite.config.js).
// In production, set VITE_API_BASE_URL to the deployed backend, e.g.
// https://velaris-perfume-store.onrender.com/api
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (typeof error.response?.data === 'object' && error.response?.data
        ? Object.values(error.response.data).join(', ')
        : null) ||
      error.message

    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }

    return Promise.reject(new Error(message))
  }
)

export default client
