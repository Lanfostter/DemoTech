import api from "../config/api.ts";
import { LoginRequest } from "../model/user.ts";

const API_URL = import.meta.env.VITE_API_END_POINT;
const BASE_API = API_URL+"/api/auth"
export async function login(data:LoginRequest) {
    try {
        return await api.post(BASE_API + "/login", data);
    } catch (error: any) {
        return error.response
    }
}