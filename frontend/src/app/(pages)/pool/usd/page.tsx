'use client'
import { useAccount } from "wagmi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetTokenBalancesQuery, useGetTokensQuery } from "@/redux/features/api/apiSlice";
import { useGetReservesQuery } from "@/redux/features/api/apiSlice";
import PoolBoxUSD from "@/components/exchange/PoolBoxUSD"


export default function Pool() {
    const { address } = useAccount()
    const { data: allTokens, isFetching: isFetchingTokens } = useGetTokensQuery()
    const { data: tokenBalances } = useGetTokenBalancesQuery(address ?? skipToken)
    const { data: reserves, isFetching: isFetchingReserve } = useGetReservesQuery()
    const tokens = allTokens?.filter(token => ['USD', 'USDT', 'ETH'].includes(token.symbol))
    const balances = tokenBalances?.filter(balance => ['USD', 'USDT', 'ETH'].includes(balance.info.symbol))

    return (
        <div className="flex flex-col justify-start items-center w-full h-full">
            {!isFetchingTokens && tokens && !isFetchingReserve && reserves &&
                <PoolBoxUSD tokens={tokens} tokenBalances={balances} reserves={reserves} />
            }
        </div >
    )
}