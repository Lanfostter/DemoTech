import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_END_POINT;

interface CurrentUser {
    token: string;
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Function to set up the interceptor with the setLoading function
 * @param setLoading - Function to control loading state
 */
export const setupInterceptor = (setLoading: (loading: boolean) => void): void => {
    api.interceptors.request.use(async (config: InternalAxiosRequestConfig & { noLoading?: boolean }) => {
        if (!config.noLoading) {
            setLoading(true);
        }

        const currentUserStr = sessionStorage.getItem("currentUser");
        const currentUser: CurrentUser | null = currentUserStr ? JSON.parse(currentUserStr) : null;

        const noAuthRequired = ["login", "register"];
        const shouldSkipToken = config.url ? noAuthRequired.some(path => config.url!.includes(path)) : false;

        if (!shouldSkipToken && currentUser?.token) {
            try {
                const decodedToken: { exp: number } = jwtDecode(currentUser.token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    redirectToLogin();
                    return Promise.reject(new Error("Token expired"));
                }

                // Đảm bảo headers không bị undefined
                config.headers = config.headers ?? {};
                config.headers.Authorization = `Bearer ${currentUser.token}`;
            } catch (error) {
                sessionStorage.removeItem("currentUser");
                return Promise.reject(error);
            }
        }

        return config;
    });

    api.interceptors.response.use(
        (response: AxiosResponse) => {
            setLoading(false);
            return response;
        },
        (error) => {
            setLoading(false);
            return Promise.reject(error);
        }
    );
};

const redirectToLogin = () => {
    setTimeout(() => {
        window.location.href = '/login';
    }, 1000);
    sessionStorage.removeItem("currentUser");
    toast.warning("Token expired! Redirecting to login...");
};

export default api;
