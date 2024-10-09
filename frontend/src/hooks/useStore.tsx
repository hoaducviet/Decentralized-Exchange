'use client'

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const useCounter = () => {
    return useSelector((state: RootState) => state.counter)
}
