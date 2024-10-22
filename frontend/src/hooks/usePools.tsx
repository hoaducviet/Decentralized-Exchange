'use client'

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const usePools = () => {
    return useSelector((state: RootState) => state.pools)
}
