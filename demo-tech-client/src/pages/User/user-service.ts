import api from "../../api/axios.ts";
import type {LoginPayload, LoginResponse, User, UserSearch} from "../../models/user.ts";
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
        return await api.post<User[]>(`${BASE_URL_USER}/paging`, payload); // data là LoginResponse
    } catch (error) {
        console.error("Login failed", error);
        throw error;
    }
}
