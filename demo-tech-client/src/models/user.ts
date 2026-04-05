import type { Search } from "./common";

export interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    role: string;
}
export interface UserSearch extends Search {
    id: number;
    name: string;
    email: string;
    role: string;
}
export interface LoginPayload {
    username: string;
    password: string;
}

export interface UserInfoResponse {
    token: string;
    refreshToken: string;
    userId: string;
    // các field khác nếu có
}

export interface CreateUserPayload {
    name: string;
    email: string;
    username: string;
    password: string;
    role: string;
}

export interface UpdateUserPayload {
    id: number;
    name: string;
    email: string;
    username?: string;
    role: string;
}

