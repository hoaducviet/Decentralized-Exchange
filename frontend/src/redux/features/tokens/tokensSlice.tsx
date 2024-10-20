import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import { Token, ETH } from "@/lib/type";
import Eth from "@/assets/token/eth.json"
const eth: ETH = Eth as ETH;

export interface TokensState {
    eth: ETH,
    tokens: Token[];
    isLoaded: boolean;
}

const initialState: TokensState = {
    eth: eth,
    tokens: [],
    isLoaded: false
}

export const tokensSlice = createSlice({
    name: 'tokens',
    initialState,
    reducers: {

        setTokens: (state, action: PayloadAction<Token[]>) => {
            if (action.payload.length > 0) {
                state.tokens = action.payload;
                state.isLoaded = true;
            }
        },
        resetTokens: (state) => {
            state.tokens = [];
            state.isLoaded = false;
        }

    }
})

export const { setTokens, resetTokens } = tokensSlice.actions;
export default tokensSlice.reducer