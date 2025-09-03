import {lazy} from "react";

const NotFoundPage = lazy(() => import("../component/NotFoundPage.tsx"));

const errorRoutes = [
    {path: "*", element: <NotFoundPage/>},
];

export default errorRoutes;
