import { Suspense } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

// Spinner chỉ hiện bên trong content — sidebar không bị ảnh hưởng
function PageSpinner() {
    return (
        <div className="flex items-center justify-center h-64">
            <div
                className="rounded-full border-4 border-t-transparent animate-spin"
                style={{ width: 36, height: 36, borderColor: '#4361EE', borderTopColor: 'transparent' }}
            />
        </div>
    );
}

export default function Layout() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto" style={{ background: '#F8F9FA' }}>
                <Suspense fallback={<PageSpinner />}>
                    <Outlet />
                </Suspense>
            </div>
        </div>
    );
}
