import { Link, useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";

const NotFoundPage = () => {
    const navigate = useNavigate();
    const [count, setCount] = useState(5);

    useEffect(() => {
        if (count <= 0) {
            if(localStorage.getItem("token")){
                navigate("/")
            }else {
                navigate("/login");
            }
            return;
        }

        const timer = setTimeout(() => setCount(count - 1), 1000);
        return () => clearTimeout(timer);
    }, [count, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl mb-2">Oops! Page not found</h2>
            <p className="mb-6 text-center max-w-md">
                The page you are looking for might have been removed, had its name changed, or is temporarily
                unavailable.
            </p>
            <p className="mb-6 text-center text-gray-600">
                Redirecting to home in {count} second{count !== 1 ? "s" : ""}...
            </p>
            <Link
                to="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFoundPage;
