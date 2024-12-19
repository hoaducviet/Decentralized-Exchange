'use client'

import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";

export interface DepositState {
    amount: string;
}

const initialState: DepositState = {
    amount: "",
}

export const depositSlice = createSlice({
    name: 'deposit',
    initialState,
    reducers: {
        setAmountDeposit: (state, action: PayloadAction<string>) => {
            state.amount = action.payload;
        },
        resetAmountDeposit: (state) => {
            state.amount = "";

        }
    }
})

export const { setAmountDeposit, resetAmountDeposit } = depositSlice.actions;
export default depositSlice.reducer