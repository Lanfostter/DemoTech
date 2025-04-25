import RedirectRoute from "../component/RedirectRoute";
import SignIn from "../component/SignIn";
import { CustomRouteObject } from "./router";

export const publicRouter: CustomRouteObject[] =  [
    {
        path: "/login",
        element: <RedirectRoute />,
        children: [
            { 
                path: "", 
                element: <SignIn /> 
            }
        ],
    }
]
