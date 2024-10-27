'use client'

import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import { Collection } from '@/lib/type'

export interface CollectionsState {
    collections: Collection[];
}

const initialState: CollectionsState = {
    collections: [],
}

export const collectionsSlice = createSlice({
    name: 'collections',
    initialState,
    reducers: {
        setCollections: (state, action: PayloadAction<Collection[]>) => {
            state.collections = action.payload;
        },
        resetCollections: (state) => {
            state.collections = []
        }

    }
})

export const { setCollections, resetCollections } = collectionsSlice.actions;
export default collectionsSlice.reducer