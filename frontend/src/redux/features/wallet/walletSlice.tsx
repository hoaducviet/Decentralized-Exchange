'use client'
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import { type BalancesType } from '@/lib/type'

export interface WalletState { balances: BalancesType[]; }
const initialState: WalletState = { balances: [] }
export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setBalances: (state, action: PayloadAction<BalancesType[]>) => {
            state.balances = action.payload;
        },
    }
})

export const { setBalances } = walletSlice.actions;
export default walletSlice.reducer