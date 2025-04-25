import { createAction } from "@reduxjs/toolkit";
import { User } from "../../model/user";

export const setUser = createAction<User | null>("auth/setUser");
export const clearUser = createAction("auth/clearUser");
export const setLoading = createAction<boolean>("auth/setLoading");
export const setError = createAction<string | null>("auth/setError");
