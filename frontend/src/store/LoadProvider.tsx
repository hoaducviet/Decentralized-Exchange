'use client'

import { useDispatch } from "react-redux";
import { setTokens } from "@/redux/features/tokens/tokensSlice";
import { Children } from "@/lib/type";
import { useBalances } from "@/hooks/useBalances";

import { Token } from "@/lib/type";
import tokenERC20 from '@/assets/token/tokens.json';
const tokens: Token[] = tokenERC20 as Token[];

interface Props {
    children: Children;
}

export function LoadProvider({ children }: Props) {
    const dispatch = useDispatch()
    dispatch(setTokens(tokens))

    const context = useBalances()
    console.log(context)

    return (<>{children}</>)
}