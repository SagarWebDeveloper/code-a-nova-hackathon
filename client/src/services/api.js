import axios from 'axios';

// withCredentials sends the httpOnly auth cookie to the API. No token is stored in the browser.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 15000,
});

export const getErrorMessage = (err) =>
  err.response?.data?.message || 'Something went wrong. Please try again.';

const unwrap = (request) => request.then((res) => res.data);

export const authApi = {
  signup: (data) => unwrap(api.post('/auth/signup', data)),
  verifyOtp: (data) => unwrap(api.post('/auth/verifyotp', data)),
  resendOtp: (data) => unwrap(api.post('/auth/resendotp', data)),
  login: (data) => unwrap(api.post('/auth/login', data)),
  logout: () => unwrap(api.post('/auth/logout')),
};

export const userApi = {
  me: () => unwrap(api.get('/user/me')).then((d) => d.user),
};

export const hackathonApi = {
  options: () => unwrap(api.get('/hackathon/options')).then((d) => d.data),
  register: (data) => unwrap(api.post('/hackathon/register', data)),
  myEntry: () => unwrap(api.get('/hackathon/myentry')).then((d) => d.data),
  remove: (id) => unwrap(api.delete(`/hackathon/${id}`)),
};

export const contactApi = {
  send: (data) => unwrap(api.post('/contact', data)),
};
