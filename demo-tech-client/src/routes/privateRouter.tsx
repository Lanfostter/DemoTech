import Auth from "../component/Auth";
import Layout from "../component/Layout";
import { userRoute } from "../view/user/userRoute";
import { CustomRouteObject } from "./router";

export const privateRouter: CustomRouteObject = {
    element: <Auth />,
    children: [
        {
            path: "/",
            element: <Layout />,
            children: [
                ...userRoute
            ],
        },
    ],
}