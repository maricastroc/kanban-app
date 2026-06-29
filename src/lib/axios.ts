import axios from 'axios'

// Auth travels in an httpOnly cookie now — `withCredentials` makes the browser
// send it on every request. No token is read from JS (XSS can't steal it).
export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ?? 'https://api.marianacastro.dev/api/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
