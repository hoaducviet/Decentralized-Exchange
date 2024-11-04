import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import counterReducer from './features/counter/counterSlice';
import collectionReducer from './features/collection/collectionSlice';
import depositReducer from './features/deposit/depositSlice';
import sidebarReducer from './features/sidebar/sidebarSlice';
import { apiSlice } from './features/api/apiSlice'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        collection: collectionReducer,
        deposit: depositReducer,
        sidebar: sidebarReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),

})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;