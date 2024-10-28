'use client'

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const useCollections = () => {
    return useSelector((state: RootState) => state.collections)
}
