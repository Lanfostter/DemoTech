import api from "../../../api/axios.ts";

export const BASE_URL = "/cache"

export const clearAllCache = async () => {
    try {
        return await api.delete(`${BASE_URL}/clear`);
    } catch (e) {
        console.error("Xóa cache thất bại", e);
    }
};

export const clearCacheByKey = async (key: string) => {
    try {
        return await api.delete(`${BASE_URL}/key/${key}`);
    } catch (e) {
        console.error("Xóa cache theo key thất bại", e);
    }
};

export const clearCacheByPrefix = async (prefix: string) => {
    try {
        return await api.delete(`${BASE_URL}/prefix/${prefix}`);
    } catch (e) {
        console.error("Xóa cache theo prefix thất bại", e);
    }
};
