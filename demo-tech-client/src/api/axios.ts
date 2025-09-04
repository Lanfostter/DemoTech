// api.ts
import axios, {AxiosError, HttpStatusCode} from "axios";
import {toast} from "react-toastify";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        console.log(token)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        return response.data.data;
    },
    (error: AxiosError<any>) => {
        if (error.response?.status === HttpStatusCode.Unauthorized) {
            toast.warning("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        } else {
            toast.error(error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
