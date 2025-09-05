// api.ts
import axios, { AxiosError, HttpStatusCode } from "axios";
import { toast } from "react-toastify";
import {refreshToken} from "../pages/User/user-service.ts";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(import.meta.env.VITE_TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response.data.data,
    async (error: AxiosError<any>) => {
        const originalRequest: any = error.config;

        if (error.response?.status === HttpStatusCode.Forbidden && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const data = await refreshToken(localStorage.getItem('refreshToken')?.toString());
                localStorage.setItem(import.meta.env.VITE_TOKEN_KEY, data.accessToken);
                localStorage.setItem(import.meta.env.VITE_RF_TOKEN_KEY, data.refreshToken);
                processQueue(null, data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem(import.meta.env.VITE_TOKEN_KEY);
                localStorage.removeItem(import.meta.env.VITE_RF_TOKEN_KEY);
                toast.warning("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        toast.error(error.message);
        return Promise.reject(error);
    }
);

export default api;
