'use client'
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import TokenChart from "@/components/chart/TokenChart"
import TokenTransactions from "@/components/explore/TokenTransactions"
import { useGetTokensQuery, useGetTokenTransactionsQuery, useGetTokenPricesQuery } from "@/redux/features/api/apiSlice"
import { skipToken } from "@reduxjs/toolkit/query"
import { Token as TokenType } from "@/lib/type"

export default function Token() {
    const [currentToken, setCurrentToken] = useState<TokenType | undefined>(undefined)
    const { token } = useParams()
    const { data: tokens } = useGetTokensQuery()
    const { data: transactions } = useGetTokenTransactionsQuery(currentToken?._id ?? skipToken)
    const { data: prices } = useGetTokenPricesQuery(currentToken?._id ?? skipToken)

    useEffect(() => {
        if (tokens) {
            setCurrentToken(tokens.find(item => item.symbol === token))
        }
    }, [tokens, token])

    return (
        <div className="flex flex-col justify-center items-start mx-[15vw] my-[2vw]">
            <div className="w-full">
                <TokenChart prices={prices ?? []} token={currentToken} />
            </div>
            <div className="flex flex-col w-full space-y-[1vw]">
                <p className="flex flex-row justify-start items-center text-md font-semibold">Transactions</p>
                <TokenTransactions transactions={transactions ?? []} symbol={token as string} />
            </div>
        </div>
    )
}