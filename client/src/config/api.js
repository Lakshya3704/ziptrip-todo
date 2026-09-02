// Centralized API configuration
const RENDER_BACKEND_URL = 'https://ziptrip-todo.onrender.com';

const rawApiUrl = import.meta.env.VITE_API_URL;

// Use local proxy in dev, or custom URL if set and valid, otherwise default to Render backend
let base = RENDER_BACKEND_URL;
if (import.meta.env.DEV) {
  base = '';
} else if (rawApiUrl && typeof rawApiUrl === 'string' && rawApiUrl.trim() !== '') {
  const cleanUrl = rawApiUrl.trim().replace(/\/+$/, '');
  // Ignore stale vercel backend URLs from old deployments
  if (!cleanUrl.includes('vercel.app') || cleanUrl.includes('onrender.com')) {
    base = cleanUrl;
  }
}

// Normalize base URL so there is never trailing slash or duplicated /api
base = base.replace(/\/+$/, '');
if (base.endsWith('/api/todos')) {
  base = base.replace(/\/api\/todos$/, '');
} else if (base.endsWith('/api')) {
  base = base.replace(/\/api$/, '');
}

export const API_BASE = base;
export const TODOS_API = `${API_BASE}/api/todos`;
