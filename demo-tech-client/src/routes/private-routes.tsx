import type { RouteObject } from "react-router-dom";
import PrivateRoute from "../component/PrivateRoute";
import Layout from "../component/Layout.tsx";
import dashboardRoute from "../pages/Dashboard/dashboard-route.tsx";
import userRoute from "../pages/User/user-route.tsx";

const privateRoutes: RouteObject[] = [
    {
        element: <PrivateRoute />, // kiểm tra login
        children: [
            {
                element: <Layout />, // Layout dùng chung
                children: [
                    ...dashboardRoute, // tất cả route dashboard
                    ...userRoute
                ],
            },
        ],
    },
];

export default privateRoutes;
