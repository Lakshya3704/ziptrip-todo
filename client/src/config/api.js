// Centralized API configuration
// - Uses VITE_API_URL if set in hosting platform environment variables
// - Defaults to '' (relative /api/todos) which is proxied by:
//   * Vite dev server in local development
//   * Vercel rewrite rules (vercel.json) in Vercel production
//   * Netlify redirect rules (_redirects / netlify.toml) in Netlify production
export const API_BASE = import.meta.env.VITE_API_URL || '';

export const TODOS_API = `${API_BASE}/api/todos`;

