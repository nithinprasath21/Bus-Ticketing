import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost/api",
  withCredentials: true,
});

export default api;