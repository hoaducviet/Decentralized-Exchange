'use client'
import { useContext } from "react"
import { Web3Context } from "@/store/Web3Provider"

export const useWeb3 = () => {
    const context = useContext(Web3Context)

    return context
}