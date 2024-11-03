'use client'
import { Children } from "@/lib/type";

interface Props {
    children: Children;
}

export function LoadProvider({ children }: Props) {

    return (<>{children}</>)
}