import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: process.env.REACT_APP_BACKEND_URL,
    baseURL: 'http://localhost:8080',
    withCredentials: true, // Send cookies with requests
});

export default axiosInstance;
