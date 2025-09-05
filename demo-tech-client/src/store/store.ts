import { configureStore } from '@reduxjs/toolkit';
import userSlice from "../features/userSlice.ts";

const store = configureStore({
    reducer: {
        user: userSlice, // thêm slice reducer vào
    },
});

export default store;
