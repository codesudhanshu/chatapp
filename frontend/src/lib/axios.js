import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://chatapp-hj3q.onrender.com/api" : "/api",
  withCredentials: true,
});
