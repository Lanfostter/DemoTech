import UserFilter from "./UserFilter.tsx";
import UserTable from "./UserTable.tsx";

export default function UserIndex() {
    return (
        <>
            <div
                className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-purple-50 p-8 space-y-8">
                {/* Header with subtle animation */}
                <h1 className="text-4xl font-bold text-gray-900 text-center animate-fade-in">
                    User Manager
                    <span className="block text-lg font-normal text-gray-500 mt-2">
                        Manage and monitor your users efficiently
                    </span>
                </h1>

                {/* Filter Section with Glassmorphism Effect */}
                <div
                    className="w-4/5 bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/30 hover:shadow-2xl transition duration-300">
                    <UserFilter/>
                </div>

                {/* Table Section with Enhanced Styling */}
                <div className="w-4/5">
                    <UserTable/>
                </div>
            </div>
        </>
    )
}