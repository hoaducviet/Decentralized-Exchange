'use client'
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const useDeposit = () => {
    return useSelector((state: RootState) => state.deposit)
}
