import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import * as React from "react";
import { User } from "../model/user";

const Auth: React.FC = () => {
    const [getUserComplete, setUserComplete] = useState<boolean>(false);
    const [isAuthenticated, setAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const user: string | null = sessionStorage.getItem("currentUser");
        const parsedUser: User = user ? JSON.parse(user) : null;
        setAuthenticated(!!parsedUser?.token);
        setUserComplete(true);
    }, []);

    if (!getUserComplete) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default Auth;
