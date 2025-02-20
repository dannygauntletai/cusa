import axios from 'axios'

const API_BASE = 'http://localhost:8000/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Log error or handle specific error cases
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
) 