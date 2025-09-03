import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {toast} from "react-toastify";

export default function PrivateRoute() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        toast.warning("You dont have permission")
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
