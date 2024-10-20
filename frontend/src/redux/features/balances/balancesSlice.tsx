import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import tokens from "@/assets/token/tokens.json";
import { type BalancesType } from '@/lib/type'

export interface BalancesState {
    balances: BalancesType[];
    isLoaded: boolean;
}
const initialState: BalancesState = {
    balances: [],
    isLoaded: false
}
export const balancesSlice = createSlice({
    name: 'balances',
    initialState,
    reducers: {
        setBalances: (state, action: PayloadAction<BalancesType>) => {
            const existed = state.balances.find(
                balance => balance.token.address === action.payload.token.address
            )
            if (!existed) {
                state.balances = [...state.balances, action.payload];
                state.isLoaded = (tokens.length + 1 === state.balances.length);
            }
        },
        resetBalances: (state) => {
            state.balances = [];
            state.isLoaded = false;
        }
    }
})

export const { setBalances, resetBalances } = balancesSlice.actions;
export default balancesSlice.reducer