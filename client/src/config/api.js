// Centralized API configuration
// In development: Uses empty string '' which Vite proxies to http://localhost:5000
// In production (Netlify/Vercel/etc.): Uses VITE_API_URL or defaults directly to Render backend
export const API_BASE = 
  import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== ''
    ? import.meta.env.VITE_API_URL
    : (import.meta.env.DEV ? '' : 'https://ziptrip-todo.onrender.com');

export const TODOS_API = `${API_BASE}/api/todos`;
