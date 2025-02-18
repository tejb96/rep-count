import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: process.env.REACT_APP_BACKEND_URL,
    baseURL: process.env.REACT_APP_SERVER_URL,
    withCredentials: true, // Send cookies with requests
});

export default axiosInstance;
