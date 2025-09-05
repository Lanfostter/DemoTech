import type {RouteObject} from "react-router-dom";
import {lazy} from "react"; // import trực tiếp
const ListUser = lazy(() => import("./List/ListUser.tsx"));

const userRoute: RouteObject[] = [
    {
        path: "/users",
        children: [
            {index: true, element: <ListUser/>}, // dùng được ngay
        ],
    }
];
export default userRoute;
