import { createReducer } from "@reduxjs/toolkit";
import { initialState } from "./authTypes";
import { setUser, clearUser, setLoading, setError } from "./authActions";
import { loginUser } from "./authThunks";

const authReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setUser, (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        })
        .addCase(clearUser, (state) => {
            state.user = null;
            state.error = null;
        })
        .addCase(setLoading, (state, action) => {
            state.loading = action.payload;
        })
        .addCase(setError, (state, action) => {
            state.error = action.payload;
        })
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
});

export default authReducer;
