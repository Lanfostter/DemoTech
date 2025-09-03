import type { RouteObject } from "react-router-dom";
import PrivateRoute from "../../component/PrivateRoute.tsx";
import DashboardPage from "../Dashboard/Dashboard.tsx"; // import trực tiếp

const dashboardRoute: RouteObject[] = [
    {
        element: <PrivateRoute />,
        path: "/",
        children: [
            { index: true, element: <DashboardPage /> }, // dùng được ngay
            { path: "/dashboard", element: <DashboardPage /> }, // dùng được ngay
        ],
    }
];
export default dashboardRoute;
