import { Outlet, Navigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";

const PublicRoute = () => {
    const { isAuthenticated } = useAuth();

    // Nếu đã login, chuyển hướng về home
    if (isAuthenticated) return <Navigate to="/" />;

    return <Outlet />; // render các route con
};

export default PublicRoute;
