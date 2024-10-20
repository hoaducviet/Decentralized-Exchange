'use client'

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const useTokens = () => {
    return useSelector((state: RootState) => state.tokens)
}
