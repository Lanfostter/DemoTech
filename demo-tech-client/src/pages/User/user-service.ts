import api from "../../api/axios.ts";
import type {LoginPayload, LoginResponse, User, UserSearch} from "../../models/user.ts";
import type {Page} from "../../models/common.ts";
export const BASE_URL_USER = "/users"
export const login = async (payload: LoginPayload) => {
    try {
        // Vì interceptor trả luôn data, không còn AxiosResponse nữa
        return await api.post<LoginResponse>("/auth/login", payload); // data là LoginResponse
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