import { createContext, useContext, ReactNode } from "react";
import { store } from "../redux/store";
import type { RootState } from "../redux/store";
import { Store } from "@reduxjs/toolkit";

// Xác định kiểu của store
type AppStore = Store<RootState, any, any>;

const StoreContext = createContext<AppStore | null>(null);

interface StoreProviderProps {
    children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = (): AppStore => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
};

export { StoreContext };
