import api from "../../api/axios.ts";


interface LoginPayload {
    username: string;
    password: string;
}

interface LoginResponse {
    token: string;
    userId: string;
    // các field khác nếu có
}

export const login = async (payload: LoginPayload) => {
    try {
        // Vì interceptor trả luôn data, không còn AxiosResponse nữa
        return await api.post<LoginResponse>("/auth/login", payload); // data là LoginResponse
    } catch (error) {
        console.error("Login failed", error);
        throw error;
    }
};
