const DEFAULT_BASE_URL = import.meta.env.DEV
    ? "http://localhost:4000"
    : "https://rate-limiter-backend-1.onrender.com";

export const BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_BASE_URL;