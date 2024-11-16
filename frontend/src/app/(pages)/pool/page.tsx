'use client'
import { useAccount } from "wagmi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetTokenBalancesQuery, useGetTokensQuery } from "@/redux/features/api/apiSlice";
import { useGetReservesQuery } from "@/redux/features/api/apiSlice";
import PoolBox from "@/components/exchange/PoolBox";

export default function Pool() {
    const { address } = useAccount()
    const { data: allTokens, isFetching: isFetchingTokens } = useGetTokensQuery()
    const { data: tokenBalances } = useGetTokenBalancesQuery(address ?? skipToken)
    const { data: reserves, isFetching: isFetchingReserve } = useGetReservesQuery()
    const tokens = allTokens?.filter(token => token.symbol !== 'USD')

    return (
        <div className="flex flex-col justify-start items-center w-full h-full">
            {!isFetchingTokens && tokens && !isFetchingReserve && reserves &&
                <PoolBox tokens={tokens} tokenBalances={tokenBalances} reserves={reserves} />
            }
        </div >
    )
}