import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, UserIcon, CogIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const menuItems = [
    { name: "Dashboard", path: "/", icon: HomeIcon },
    { name: "Users", path: "/users", icon: UserIcon },
    { name: "Settings", path: "/settings", icon: CogIcon },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    return (
        <div className={`h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}>
            {/* Toggle button đẹp hơn */}
            <button
                className="flex items-center justify-center m-2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors shadow-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <ChevronLeftIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
            </button>

            {/* Menu */}
            <nav className="flex-1 mt-5">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors ${
                                isActive ? "bg-gray-700 font-bold" : ""
                            } rounded-lg mx-2 my-1`}
                        >
                            <Icon className="h-6 w-6" />
                            {isOpen && <span>{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
