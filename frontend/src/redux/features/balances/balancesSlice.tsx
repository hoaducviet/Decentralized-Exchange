import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import { TokenBalancesType, LiquidBalancesType } from '@/lib/type'

export interface BalancesState {
    tokenBalances: TokenBalancesType[];
    liquidBalances: LiquidBalancesType[];
    isLoaded: boolean;
}
const initialState: BalancesState = {
    tokenBalances: [],
    liquidBalances: [],
    isLoaded: false
}
export const balancesSlice = createSlice({
    name: 'balances',
    initialState,
    reducers: {
        setTokenBalances: (state, action: PayloadAction<TokenBalancesType[]>) => {
            state.tokenBalances = action.payload;
            if (state.tokenBalances.length > 0 && state.liquidBalances.length > 0) {
                state.isLoaded = true;
            }
        },
        setLiquidBalances: (state, action: PayloadAction<LiquidBalancesType[]>) => {
            state.liquidBalances = action.payload;
            if (state.tokenBalances.length > 0 && state.liquidBalances.length > 0) {
                state.isLoaded = true;
            }
        },
        resetBalances: (state) => {
            state.tokenBalances = [];
            state.liquidBalances = [];
            state.isLoaded = false;
        }
    }
})

export const { setTokenBalances, setLiquidBalances, resetBalances } = balancesSlice.actions;
export default balancesSlice.reducer