import { useRoutes } from "react-router-dom";
import publicRoutes from "./public-routes";
import errorRoutes from "./error-routes";
import privateRoutes from "./private-routes.tsx";

export default function AppRoutes() {
    const routes = useRoutes([
        ...publicRoutes,
        ...privateRoutes,
        ...errorRoutes,
    ]);

    return routes;
}
