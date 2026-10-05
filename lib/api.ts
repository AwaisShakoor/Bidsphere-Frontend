import axios from "axios";

// Create a reusable Axios instance
const api = axios.create({
  // Same-origin by default so /api is proxied to the backend (see next.config.ts).
  // Set NEXT_PUBLIC_API_URL only when the browser should call the API host directly.
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  
  // Important: This allows sending cookies and authorization headers
  withCredentials: true,
  
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
