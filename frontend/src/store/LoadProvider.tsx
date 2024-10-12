'use client'

import { Children } from "@/lib/type";
import { useWallet } from "@/hooks/useWallet";
interface Props {
    children: Children;
}

export function LoadProvider({ children }: Props) {

    const context = useWallet()
    console.log(context)

    return (<>{children}</>)
}