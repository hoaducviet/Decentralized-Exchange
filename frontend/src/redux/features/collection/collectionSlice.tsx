'use client'
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";
import { Collection, NFT } from '@/lib/type'

export interface CollectionsState {
    currentCollection: Collection | undefined;
    nfts: NFT[];
    listed: NFT[];
    mylist: NFT[];
}

const initialState: CollectionsState = {
    currentCollection: undefined,
    nfts: [],
    listed: [],
    mylist: [],
}

export const collectionSlice = createSlice({
    name: 'collection',
    initialState,
    reducers: {
        setCurrentCollection: (state, action: PayloadAction<Collection>) => {
            state.currentCollection = action.payload;
        },
        setNFTs: (state, action: PayloadAction<NFT[]>) => {
            state.nfts = action.payload;
        },
        setListed: (state, action: PayloadAction<NFT[]>) => {
            state.listed = action.payload;
        },
        setMylist: (state, action: PayloadAction<NFT[]>) => {
            state.mylist = action.payload;
        },
        resetCurrentCollection: (state) => {
            state.currentCollection = undefined;
            state.nfts = [];
            state.listed = [];
        },
        resetNFTs: (state) => {
            state.nfts = [];
            state.listed = [];
        }

    }
})

export const { setCurrentCollection, setNFTs, setListed, setMylist, resetCurrentCollection, resetNFTs } = collectionSlice.actions;
export default collectionSlice.reducer