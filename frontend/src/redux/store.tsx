import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import collectionReducer from './features/collection/collectionSlice';
import depositReducer from './features/deposit/depositSlice';
import sidebarReducer from './features/sidebar/sidebarSlice';
import { apiSlice } from './features/api/apiSlice'
import { paySlice } from '@/redux/features/pay/paySlice';

export const store = configureStore({
    reducer: {
        collection: collectionReducer,
        deposit: depositReducer,
        sidebar: sidebarReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        [paySlice.reducerPath]: paySlice.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiSlice.middleware)
            .concat(paySlice.middleware)
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;