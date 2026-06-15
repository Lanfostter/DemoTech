import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function PrivateRoute() {
    const { isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        toast.warning("Vui lòng đăng nhập");
        return <Navigate to="/login" replace />;
    }

    // Admin landing: redirect "/" to /users
    if (isAdmin && window.location.pathname === '/') {
        return <Navigate to="/users" replace />;
    }

    // Student landing: redirect "/" to /dashboard
    if (!isAdmin && (window.location.pathname === '/' || window.location.pathname === '')) {
        return <Navigate to="/dashboard" replace />;
    }

    // Onboarding check for non-admin users
    const onboardingDone = localStorage.getItem('onboarding_done');
    if (!isAdmin && !onboardingDone && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }

    return <Outlet />;
}
