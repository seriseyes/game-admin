import axios from 'axios';

const dev = import.meta.env.DEV;

const AxiosInstance = axios.create({
    baseURL: dev ? "http://localhost:3000/admin" : "/admin",
});

export default AxiosInstance;
