import axios from "axios";

const API_BASE_URL = "http://192.168.169.116:5000/api";  

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
