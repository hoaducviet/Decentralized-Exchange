'use client'
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import { Collection, PendingCollection } from '@/lib/type'

export interface CollectionsState {
    currentCollection: Collection | undefined;
    currentPendingCollection: PendingCollection | undefined;

}

const initialState: CollectionsState = {
    currentCollection: undefined,
    currentPendingCollection: undefined,
}

export const collectionSlice = createSlice({
    name: 'collection',
    initialState,
    reducers: {
        setCurrentCollection: (state, action: PayloadAction<Collection | undefined>) => {
            state.currentCollection = action.payload;
        },
        setCurrentPendingCollection: (state, action: PayloadAction<PendingCollection | undefined>) => {
            state.currentPendingCollection = action.payload;
        },
        resetCurrentCollection: (state) => {
            state.currentCollection = undefined;
        },
        resetCurrentPendingCollection: (state) => {
            state.currentPendingCollection = undefined;
        },
    }
})

export const { setCurrentCollection, setCurrentPendingCollection, resetCurrentCollection, resetCurrentPendingCollection } = collectionSlice.actions;
export default collectionSlice.reducer