'use client'
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const useBalances = () => {
    return useSelector((state: RootState) => state.balances)
}
