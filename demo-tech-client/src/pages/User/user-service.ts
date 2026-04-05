import api from "../../api/axios.ts";
import type {UserInfoResponse, User, UserSearch, CreateUserPayload, UpdateUserPayload} from "../../models/user.ts";
import type {Page} from "../../models/common.ts";

export const BASE_URL_USER = "/users";

export const login = async (payload: { username: string; password: string }) => {
    try {
        // Vì interceptor trả luôn data, không còn AxiosResponse nữa
        return await api.post<UserInfoResponse>("/auth/login", payload); // data là UserInfoResponse
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
};

// 👉 Hàm refresh token
export const refreshToken = async (refreshToken: string | undefined) => {
    try {
        return await api.post<{ accessToken: string; refreshToken: string }>("/auth/refresh-token", {
            refreshToken,
        });
    } catch (error) {
        console.error("Refresh token failed", error);
        throw error;
    }
};

/**
 * Create a new user
 * @param payload - User creation data (name, email, username, password, role)
 * @returns Created user data
 */
export const createUser = async (payload: CreateUserPayload) => {
    try {
        return await api.post<User>(`${BASE_URL_USER}`, payload);
    } catch (error) {
        console.error("Create user failed", error);
        throw error;
    }
};

/**
 * Update an existing user
 * @param payload - User update data (id, name, email, role)
 * @returns Updated user data
 */
export const updateUser = async (payload: UpdateUserPayload) => {
    try {
        const { id, ...data } = payload;
        return await api.put<User>(`${BASE_URL_USER}/${id}`, data);
    } catch (error) {
        console.error("Update user failed", error);
        throw error;
    }
};

/**
 * Delete a user by ID
 * @param userId - The user ID to delete
 * @returns Response from server
 */
export const deleteUser = async (userId: number) => {
    try {
        return await api.delete(`${BASE_URL_USER}/${userId}`);
    } catch (error) {
        console.error("Delete user failed", error);
        throw error;
    }
};

