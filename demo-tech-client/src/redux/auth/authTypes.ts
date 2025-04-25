import { User } from "../../model/user";

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

export const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};
