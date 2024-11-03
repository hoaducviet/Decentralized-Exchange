'use client'
import { useAccount } from "wagmi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetTokenBalancesQuery, useGetTokensQuery } from "@/redux/features/api/apiSlice";
import { useGetReservePoolQuery } from "@/redux/features/api/apiSlice";
import PoolBoxUSD from "@/components/exchange/PoolBoxUSD"


export default function Pool() {
    const { address } = useAccount()
    const { data: allTokens, isFetching: isFetchingTokens } = useGetTokensQuery()
    const { data: tokenBalances } = useGetTokenBalancesQuery(address ?? skipToken)
    const { data: reservePools, isFetching: isFetchingReserve } = useGetReservePoolQuery()
    const tokens = allTokens?.filter(token => ['USD', 'USDT', 'ETH'].includes(token.symbol))
    const balances = tokenBalances?.filter(balance => ['USD', 'USDT', 'ETH'].includes(balance.info.symbol))

    return (
        <div className="flex flex-col justify-start items-center w-full h-full">
            {!isFetchingTokens && tokens && !isFetchingReserve && reservePools &&
                <PoolBoxUSD tokens={tokens} tokenBalances={balances} reservePools={reservePools} />
            }
        </div >
    )
}