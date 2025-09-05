import type {RouteObject} from "react-router-dom";
import CacheManager from "./Cache/CacheManager.tsx";

const settingRoute: RouteObject[] = [
    {
        path: "/settings",
        children: [
            { path: "cache", element: <CacheManager /> }, // ✅ đường dẫn relative
        ],
    }
];
export default settingRoute;
