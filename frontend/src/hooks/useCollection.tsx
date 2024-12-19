'use client'

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const useCollection = () => {
    return useSelector((state: RootState) => state.collection)
}
