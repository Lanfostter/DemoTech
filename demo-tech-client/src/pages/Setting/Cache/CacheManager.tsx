import { useState } from "react";
import { clearAllCache, clearCacheByKey, clearCacheByPrefix } from "./cache-service.ts";
import { toast } from "react-toastify";

export default function CacheManager() {
    const [key, setKey] = useState("");
    const [prefix, setPrefix] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleClearAll = async () => {
        setLoading(true);
        try {
            const response = await clearAllCache();
            const msg = (response as any)?.message ?? "Đã xóa toàn bộ cache";
            toast.success(msg);
            setMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleClearByKey = async () => {
        if (!key) return;
        setLoading(true);
        try {
            const response = await clearCacheByKey(key);
            const msg = (response as any)?.message ?? "Đã xóa cache theo key";
            toast.success(msg);
            setMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleClearByPrefix = async () => {
        if (!prefix) return;
        setLoading(true);
        try {
            const response = await clearCacheByPrefix(prefix);
            const msg = (response as any)?.message ?? "Đã xóa cache theo prefix";
            toast.success(msg);
            setMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6 bg-gray-50 shadow rounded-lg">
            <h1 className="text-xl font-bold text-center text-gray-800">
                🗑️ Cache Manager
            </h1>

            <div className="flex justify-center">
                <button
                    onClick={handleClearAll}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 disabled:opacity-50"
                >
                    {loading ? "Đang xử lý..." : "Xóa toàn bộ cache"}
                </button>
            </div>

            <div className="space-y-2">
                <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Nhập key cần xóa"
                    className="w-full px-3 py-2 border rounded"
                />
                <button
                    onClick={handleClearByKey}
                    disabled={loading || !key}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
                >
                    Xóa theo Key
                </button>
            </div>

            <div className="space-y-2">
                <input
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="Nhập prefix cần xóa"
                    className="w-full px-3 py-2 border rounded"
                />
                <button
                    onClick={handleClearByPrefix}
                    disabled={loading || !prefix}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:opacity-50"
                >
                    Xóa theo Prefix
                </button>
            </div>

            {message && (
                <p className="mt-4 text-center text-gray-800 font-medium">{message}</p>
            )}
        </div>
    );
}
