'use client'
import { useAccount } from "wagmi";
import { useLoadBalance } from "@/hooks/useLoadBalance"
import { Children } from "@/lib/type";

interface Props {
    children: Children;
}
import { type Token } from '@/lib/type';
import tokenList from "@/assets/token/tokenList.json";
const tokens: Token[] = tokenList as Token[];

export function LoadProvider({ children }: Props) {
    const { balances } = useLoadBalance()

    return (<>{children}</>)
}