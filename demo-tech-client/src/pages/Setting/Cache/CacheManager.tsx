import {useState} from "react";
import {clearAllCache} from "./cache-service.ts";
import {toast} from "react-toastify";

export default function CacheManager() {
    const [key, setKey] = useState("");
    const [prefix, setPrefix] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const clearCache = async () => {
        const response = await clearAllCache()
        toast.success(response.message)
        setMessage(response.message)
    }

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6 bg-gray-50 shadow rounded-lg">
            <h1 className="text-xl font-bold text-center text-gray-800">
                🗑️ Cache Manager
            </h1>

            {/* Xóa toàn bộ */}
            <div className="flex justify-center">
                <button
                    onClick={() => clearCache()}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 disabled:opacity-50"
                >
                    {loading ? "Đang xử lý..." : "Xóa toàn bộ cache"}
                </button>
            </div>

            {/* Xóa theo key */}
            <div className="space-y-2">
                <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Nhập key cần xóa"
                    className="w-full px-3 py-2 border rounded"
                />
                <button
                    onClick={() =>
                        callApi(`http://localhost:8080/api/cache/key/${key}`, "DELETE")
                    }
                    disabled={loading || !key}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
                >
                    Xóa theo Key
                </button>
            </div>

            {/* Xóa theo prefix */}
            <div className="space-y-2">
                <input
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="Nhập prefix cần xóa"
                    className="w-full px-3 py-2 border rounded"
                />
                <button
                    onClick={() =>
                        callApi(`http://localhost:8080/api/cache/prefix/${prefix}`, "DELETE")
                    }
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
