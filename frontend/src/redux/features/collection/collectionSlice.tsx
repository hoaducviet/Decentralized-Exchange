'use client'
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import { Collection } from '@/lib/type'

export interface CollectionsState {
    currentCollection: Collection | undefined;

}

const initialState: CollectionsState = {
    currentCollection: undefined,
}

export const collectionSlice = createSlice({
    name: 'collection',
    initialState,
    reducers: {
        setCurrentCollection: (state, action: PayloadAction<Collection>) => {
            state.currentCollection = action.payload;
        },
        resetCurrentCollection: (state) => {
            state.currentCollection = undefined;
        },
    }
})

export const { setCurrentCollection, resetCurrentCollection } = collectionSlice.actions;
export default collectionSlice.reducer