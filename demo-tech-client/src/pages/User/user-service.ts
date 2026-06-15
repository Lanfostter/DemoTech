import api from "../../api/axios.ts";
import type {ApiResponse} from "../../models/api-response.ts";
import type {LoginPayload, LoginResponse, User, UserSearch} from "../../models/user.ts";
import type {Page} from "../../models/common.ts";
export const BASE_URL_USER = "/users"

// Interceptor trả response.data (ApiResponse<T>), nên cast về đúng kiểu
export const login = async (payload: LoginPayload): Promise<ApiResponse<LoginResponse>> => {
    try {
        return await api.post<LoginResponse>("/auth/login", payload) as unknown as ApiResponse<LoginResponse>;
    } catch (error) {
        console.error("Login failed", error);
        throw error;
    }
};
export const pagingUser = async (payload: UserSearch) => {
    try {
        return await api.post<Page<User>>(`${BASE_URL_USER}/paging`, payload); // data là LoginResponse
    } catch (error) {
        console.error("Login failed", error);
        throw error;
    }
}
export const register = async (payload: { name: string; email: string; username: string; password: string }) => {
    return await api.post('/auth/register', payload) as unknown as ApiResponse<null>;
};

export const forgotPassword = async (email: string) => {
    return await api.post('/auth/forgot-password', { email }) as unknown as ApiResponse<null>;
};

export const resetPassword = async (token: string, newPassword: string) => {
    return await api.post('/auth/reset-password', { token, newPassword }) as unknown as ApiResponse<null>;
};

// 👉 Hàm refresh token
export const refreshToken = async (refreshToken: string | undefined) => {
    try {
        return  await api.post<{ accessToken: string; refreshToken: string }>("/auth/refresh-token", {
            refreshToken,
        });
    } catch (error) {
        console.error("Refresh token failed", error);
        throw error;
    }
};