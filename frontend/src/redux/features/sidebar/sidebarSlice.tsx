'use client'

import { createSlice } from "@reduxjs/toolkit"

export interface SidebarState {
    isOpen: boolean;
}

const initialState: SidebarState = {
    isOpen: false,
}

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setIsOpen: (state) => { state.isOpen = !state.isOpen },
        resetIsOpen: (state) => { state.isOpen = false }
    }
})

export const { setIsOpen, resetIsOpen } = sidebarSlice.actions;
export default sidebarSlice.reducer