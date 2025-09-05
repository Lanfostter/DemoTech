import {createSlice, createAsyncThunk, type PayloadAction} from "@reduxjs/toolkit";
import type {User, UserSearch} from "../models/user.ts";
import {pagingUser} from "../pages/User/user-service.ts";
import type {Page} from "../models/common.ts";

export const fetchUsers = createAsyncThunk(
    "user/fetchUsers",
    async (payload: UserSearch, thunkAPI) => {
        try {
            const {data} = await pagingUser(payload);
            return {
                content: data.content,
                totalElements: data.totalElements,
                totalPages: data.totalPages,
                pageIndex: data.pageIndex,
                pageSize: data.pageSize,
            } as Page<User>;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

interface UserState {
    page: Page<User>;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    page: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        pageIndex: 1,
        pageSize: 10,
    },
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setPageIndex: (state, action: PayloadAction<number>) => {
            state.page.pageIndex = action.payload;
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            state.page.pageSize = action.payload;
            state.page.pageIndex = 1; // reset về trang đầu khi đổi pageSize
        },
        resetUser: () => initialState,  // reset slice về initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.page = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {setPageIndex, setPageSize, resetUser} = userSlice.actions;
export default userSlice.reducer;
