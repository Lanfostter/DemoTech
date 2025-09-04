import type { RouteObject } from "react-router-dom";
import ListUser from "./List/ListUser.tsx"; // import trực tiếp

const userRoute: RouteObject[] = [
    {
        path: "/users",
        children: [
            { index: true, element: <ListUser /> }, // dùng được ngay
        ],
    }
];
export default userRoute;
