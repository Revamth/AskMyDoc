import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

export const loginUser = (payload) => API.post("/auth/login", payload);
export const signupUser = (payload) => API.post("/auth/signup", payload);

export default API;
