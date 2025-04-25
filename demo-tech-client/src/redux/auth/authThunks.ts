import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginRequest } from "../../model/user";
import { login } from "../../services/auth";
import { HttpStatusCode } from "axios";
import { toast } from "react-toastify";

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials: LoginRequest, { rejectWithValue }) => {
        try {
            const response = await login(credentials);
            if (response.status === HttpStatusCode.Ok) {
                toast.success("Login success");
                return response.data; // API trả về thông tin user
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
);
