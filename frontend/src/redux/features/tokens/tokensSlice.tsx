import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import { Token } from "@/lib/type";

export interface TokensState {
    tokens: Token[];
    isLoaded: boolean;
}

const initialState: TokensState = {
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