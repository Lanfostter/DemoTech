import React, { useEffect, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

// Định nghĩa kiểu props cho component
interface ProtectedRouteProps {
    permissions: boolean;
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ permissions, children }) => {
    const currentUser = sessionStorage.getItem("currentUser");
    const user = currentUser ? JSON.parse(currentUser) as { role?: string } : null;

    useEffect(() => {
        if (!user || !permissions) {
            toast.warning("You don't have permission!");
        }
    }, [permissions, user]);

    if (!user || !permissions) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
