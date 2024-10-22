import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import { Pool } from "@/lib/type";

export interface TokensState {
    pools: Pool[];
    isLoaded: boolean;
}

const initialState: TokensState = {
    pools: [],
    isLoaded: false
}

export const poolsSlice = createSlice({
    name: 'pools',
    initialState,
    reducers: {

        setPools: (state, action: PayloadAction<Pool[]>) => {
            if (action.payload.length > 0) {
                state.pools = action.payload;
                state.isLoaded = true;
            }
        },
        resetPools: (state) => {
            state.pools = [];
            state.isLoaded = false;
        }

    }
})

export const { setPools, resetPools } = poolsSlice.actions;
export default poolsSlice.reducer