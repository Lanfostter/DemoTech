import type { Search } from "./common";

export interface User {
    id: number;
    name: string;
    email: string;
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

export interface LoginResponse {
    username: string;
    email: string | null;
    roles: string[];
    token: string;
    refreshToken: string;
}
