import { configureStore } from '@reduxjs/toolkit';
import friendReducer from '../features/friend/friendSlice';
import authReducer from '@/features/auth/authSlice';
export const store = configureStore({
    reducer: {
        friend: friendReducer,
        auth: authReducer,
    },
});