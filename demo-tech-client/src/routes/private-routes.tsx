import type { RouteObject } from "react-router-dom";
import dashboardRoute from "../pages/Dashboard/dashboard-route.tsx";
import Layout from "../component/Layout.tsx";

const privateRoutes: RouteObject[] = [
    {
        element: <Layout />, // Layout bọc các route con
        children: [
            ...dashboardRoute, // tất cả các route dashboard sẽ nằm trong Layout
        ],
    },
];

export default privateRoutes;
