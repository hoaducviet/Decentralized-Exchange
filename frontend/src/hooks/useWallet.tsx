'use client'

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const useWallet = () => {
    return useSelector((state: RootState) => state.wallet)
}
