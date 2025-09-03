import PublicRoute from "../component/PublicRoute";
import LoginPage from "../pages/User/Login/LoginPage";
import {Navigate, type RouteObject} from "react-router-dom";

const publicRoutes: RouteObject[] = [
    {
        element: <PublicRoute/>,
        children: [
            {
                path: "/",
                element: <Navigate to="/login" replace />, // auto redirect
            },
            {
                path: "/login",
                element: <LoginPage/>, // component trực tiếp
            },
        ],
    },
];

export default publicRoutes;
