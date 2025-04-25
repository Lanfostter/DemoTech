import {ROLE} from "../helper/enum.ts";

export interface User {
    id: string;
    name: string;
    role: ROLE;
    token: string
}

export interface LoginRequest {
    username?: string;
    password?: string;
}