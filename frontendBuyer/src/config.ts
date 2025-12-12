const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
export const API_URL = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;
