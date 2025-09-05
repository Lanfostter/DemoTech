import {useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {
    HomeIcon,
    UserIcon,
    CogIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
    {name: "Dashboard", path: "/", icon: HomeIcon},
    {
        name: "Users",
        icon: UserIcon,
        children: [
            {name: "List Users", path: "/users"},
            {name: "Create User", path: "/users/create"},
        ],
    },
    {
        name: "Settings",
        icon: CogIcon,
        children: [
            {name: "Cache", path: "/settings/cache"},
            {name: "Security", path: "/settings/security"},
        ],
    },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const location = useLocation();

    const toggleMenu = (name: string) => {
        setOpenMenus((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
    };

    return (
        <div className={`h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}>
            {/* Toggle button */}
            <button
                className="flex items-center justify-center m-2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors shadow-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <ChevronLeftIcon className="h-5 w-5"/> : <ChevronRightIcon className="h-5 w-5"/>}
            </button>

            {/* Menu */}
            <nav className="flex-1 mt-5">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    if (item.children) {
                        const isMenuOpen = openMenus.includes(item.name);
                        return (
                            <div key={item.name} className="mx-2 my-1">
                                <button
                                    onClick={() => toggleMenu(item.name)}
                                    className={`flex w-full items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                                        isMenuOpen ? "bg-gray-700" : ""
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="h-6 w-6"/>
                                        {isOpen && <span>{item.name}</span>}
                                    </div>
                                    {isOpen && (isMenuOpen ? <ChevronUpIcon className="h-5 w-5"/> : <ChevronDownIcon className="h-5 w-5"/>)}
                                </button>

                                {/* Submenu */}
                                {isMenuOpen && isOpen && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {item.children.map((child) => {
                                            const isChildActive = location.pathname === child.path;
                                            const ChildIcon = child.icon || null;
                                            return (
                                                <Link
                                                    key={child.name}
                                                    to={child.path}
                                                    className={`flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition-colors ${
                                                        isChildActive ? "bg-gray-700 font-bold" : ""
                                                    }`}
                                                >
                                                    {ChildIcon && <ChildIcon className="h-4 w-4"/>}
                                                    <span>{child.name}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.name}
                            to={item.path!}
                            className={`flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors ${
                                isActive ? "bg-gray-700 font-bold" : ""
                            } rounded-lg mx-2 my-1`}
                        >
                            <Icon className="h-6 w-6"/>
                            {isOpen && <span>{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
