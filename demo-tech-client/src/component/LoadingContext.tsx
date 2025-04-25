// src/context/LoadingContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho context
interface LoadingContextType {
    loading: boolean;
    setLoading: (value: boolean) => void;
}

// Tạo context với giá trị mặc định là null
const LoadingContext = createContext<LoadingContextType | null>(null);

interface LoadingProviderProps {
    children: ReactNode;
}

// Provider bọc toàn bộ ứng dụng
export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

// Custom hook để sử dụng context
export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};
