//src/api/axiosInstance.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5005/api",
  withCredentials: true,
   headers: {
    "Content-Type": "application/json",
  },
});
export default api;