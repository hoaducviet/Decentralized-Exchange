'use client'
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import tokens from "@/assets/token/tokenList.json";
import { type BalancesType } from '@/lib/type'

export interface WalletState {
    balances: BalancesType[];
    isLoaded: boolean;
}
const initialState: WalletState = {
    balances: [],
    isLoaded: false
}
export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setBalances: (state, action: PayloadAction<BalancesType>) => {
            const existed = state.balances.find(
                balance => balance.token.address === action.payload.token.address
            )
            if (!existed) {
                state.balances = [...state.balances, action.payload];
                state.isLoaded = (tokens.length === state.balances.length);
            }
        },
        resetBalances: (state) => {
            state.balances = [];
            state.isLoaded = false;
        }
    }
})

export const { setBalances, resetBalances } = walletSlice.actions;
export default walletSlice.reducer