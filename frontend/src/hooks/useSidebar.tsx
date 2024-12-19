'use client'
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const useSidebar = () => {
    return useSelector((state: RootState) => state.sidebar)
}
