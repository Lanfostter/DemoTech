import PublicRoute from "../component/PublicRoute";
import LoginPage from "../pages/User/Login/LoginPage";
import RegisterPage from "../pages/User/Register/RegisterPage";
import ForgotPasswordPage from "../pages/User/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "../pages/User/ForgotPassword/ResetPasswordPage";
import {Navigate, type RouteObject} from "react-router-dom";

const publicRoutes: RouteObject[] = [
    {
        element: <PublicRoute/>,
        children: [
            { path: "/",               element: <Navigate to="/login" replace /> },
            { path: "/login",          element: <LoginPage /> },
            { path: "/register",       element: <RegisterPage /> },
            { path: "/forgot-password",element: <ForgotPasswordPage /> },
            { path: "/reset-password", element: <ResetPasswordPage /> },
        ],
    },
];

export default publicRoutes;
