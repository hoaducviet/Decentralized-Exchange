'use client'
import { Children } from "@/lib/type";

interface Props {
    children: Children;
}

export function SocketProvider({ children }: Props) {



    return (<>{children}</>)
}