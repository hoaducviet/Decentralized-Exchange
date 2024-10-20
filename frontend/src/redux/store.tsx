import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import balancesReducer from './features/balances/balancesSlice';
import counterReducer from './features/counter/counterSlice';
import tokensReducer from './features/tokens/tokensSlice';
import { apiSlice } from './features/api/apiSlice'

export const store = configureStore({

    reducer: {
        balances: balancesReducer,
        counter: counterReducer,
        tokens: tokensReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,

    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),

})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;