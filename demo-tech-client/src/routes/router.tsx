import React from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import ProtectedRoute from "../component/ProtectedRoute";
import { privateRouter } from "./privateRouter.tsx";
import { publicRouter } from "./publicRouter.tsx";

export type CustomRouteObject = Omit<RouteObject, "element" | "index"> & {
    element?: React.ReactNode;
    permissions?: boolean;
    index?: false | undefined;
    children?: CustomRouteObject[];
};

const wrapWithProtectedRoute = (routes: CustomRouteObject[]): CustomRouteObject[] =>
    routes.map((route) => ({
        ...route,
        element: route.permissions
            ? <ProtectedRoute permissions={route.permissions ?? true}>{route.element}</ProtectedRoute>
            : route.element ?? null,
        children: route.children?.length ? wrapWithProtectedRoute(route.children) : undefined,
    }));

const routeConfig: CustomRouteObject[] = [
    privateRouter,
    ...publicRouter
];
const routes = createBrowserRouter(wrapWithProtectedRoute(routeConfig) as RouteObject[]);

export default routes;
