import {createContext, useContext, useState, useEffect, type ReactNode} from "react";
import {jwtDecode} from "jwt-decode";

interface AuthContextType {
    user: any;
    token: string | null;
    login: (token: string, refreshToken: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const STORAGE_KEY = import.meta.env.VITE_TOKEN_KEY || "accessToken";
    const STORAGE_RF_KEY = import.meta.env.VITE_RF_TOKEN_KEY || "refreshToken";

    const [token, setToken] = useState<string | null>(
        localStorage.getItem(STORAGE_KEY)
    );
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setUser(decoded);
            } catch (e) {
                console.error("Invalid token", e);
                // ❌ không xóa token ngay, để user vẫn ở login page
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [token]);

    const login = (accessToken: string, refreshToken: string) => {
        localStorage.setItem(STORAGE_KEY, accessToken);
        localStorage.setItem(STORAGE_RF_KEY, refreshToken);
        setToken(accessToken);
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_RF_KEY);
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{user, token, login, logout, isAuthenticated: !!token}}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
