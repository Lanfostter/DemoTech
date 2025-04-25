import api from "../config/api.ts";
import {UserSearch} from "../model/search.ts";
import {Page} from "../model/page.ts";
import {ApiResponse} from "../model/apiResponse.ts";
import { User } from "../model/user.ts";

const API_URL = import.meta.env.VITE_API_END_POINT;
const BASE_API = API_URL+"/api/users"

export async function paging(data: UserSearch) {
    try {
        const response = await api.post<ApiResponse<Page<User>>>(BASE_API + "/paging", data);
        return response;
    } catch (error: any) {
        console.error("Paging error:", error);
        throw new Error(error.response?.data?.message || "Lỗi khi phân trang");
    }
}
