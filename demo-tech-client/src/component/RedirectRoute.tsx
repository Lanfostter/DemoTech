import { Navigate, Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { User } from "../model/user";

const RedirectRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const user = sessionStorage.getItem("currentUser");
        try {
            const parsedUser: User | null = user ? JSON.parse(user) as User : null;
            setIsAuthenticated(!!parsedUser?.token);
        } catch (error) {
            console.error("Error parsing user data:", error);
            setIsAuthenticated(false);
        }
    }, []);

    if (isAuthenticated === null) return null; // Chờ dữ liệu được load

    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default RedirectRoute;
