'use client'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAccount } from "wagmi";
import { useBalances } from "@/hooks/useBalances";
import { usePools } from "@/hooks/usePools";
import { useTokens } from "@/hooks/useTokens";
import { useWeb3 } from "@/hooks/useWeb3";
import { setTokens } from "@/redux/features/tokens/tokensSlice";
import { setPools } from "@/redux/features/pools/poolsSlice";
import { setLiquidBalances, setTokenBalances } from "@/redux/features/balances/balancesSlice";
import { getLiquidBalances } from "@/utils/getLiquidBalances";
import { getTokenBalances } from "@/utils/getTokenBalances";
import { Children, Token, Pool } from "@/lib/type";
import tokenERC20 from '@/assets/token/tokens.json';
import eth from '@/assets/token/eth.json';
import poolTokens from '@/assets/pool/pools.json';

const ethInfo: Token = eth as Token;
const tokensERC20: Token[] = tokenERC20 as Token[];
const poolsInfo: Pool[] = poolTokens as Pool[];
const tokensInfo = [ethInfo, ...tokensERC20]

interface Props {
    children: Children;
}

export function LoadProvider({ children }: Props) {
    const { address, isConnected } = useAccount()
    const dispatch = useDispatch()
    const web3 = useWeb3()
    const provider = web3?.provider
    const { isLoaded } = useBalances()



    useEffect(() => {
        const setData = async () => {
            dispatch(setTokens(tokensInfo))
            dispatch(setPools(poolsInfo))
        }

        setData()
    }, [dispatch])

    const { pools } = usePools()
    const { tokens } = useTokens()

    // Get liquid pool balances
    useEffect(() => {
        if (!!pools.length && tokens.length && !!provider && isConnected && !!address) {
            const liquidBalanaces = async () => {
                const balances = await getLiquidBalances({ pools, tokens, provider, address })
                dispatch(setLiquidBalances(balances))
            }
            liquidBalanaces()
        }
    }, [pools, tokens, provider, isConnected, address, isLoaded, dispatch])

    //Get token balances
    useEffect(() => {
        if (!!pools.length && tokens.length && !!provider && isConnected && !!address) {
            const tokenBalanaces = async () => {
                const balances = await getTokenBalances({ tokens, provider, address })
                dispatch(setTokenBalances(balances))
            }
            tokenBalanaces()
        }
    }, [tokens, provider, isConnected, address, isLoaded, dispatch])



    return (<>{children}</>)
}