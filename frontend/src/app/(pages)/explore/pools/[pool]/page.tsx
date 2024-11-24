'use client'
import { useParams } from "next/navigation"
import PoolChart from "@/components/chart/poolChart"
import PoolTransactions from "@/components/explore/PoolTransactions"
import { skipToken } from "@reduxjs/toolkit/query"
import { useGetPoolTransactionsByAddressQuery } from '@/redux/features/api/apiSlice'
import { Address } from "@/lib/type"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Pool() {
    const { pool } = useParams()
    const { data: transactions, isFetching: isFetchingTransaction } = useGetPoolTransactionsByAddressQuery(pool as Address ?? skipToken)

    return (
        <div className="flex flex-col justify-center items-start mx-[15vw] my-[5vw]">
            <div className="flex flex-row justify-start text-2xl font-semibold">
                {transactions && <>
                    <div className="flex flex-row justify-start items-center space-x-[0.3vw]">
                        <Avatar className="w-[2.5vw] h-[2.5vw] max-w-[5vw] border border-black">
                            <div className="realtive flex">
                                <AvatarImage src={transactions[0]?.pool_id.token1_id?.img}
                                    className="absolute w-full h-full object-cover"
                                    style={{ clipPath: "inset(0 50% 0 0)" }}
                                    alt="Token1" />
                                <AvatarImage src={transactions[0]?.pool_id.token2_id?.img}
                                    className="absolute w-full h-full object-cover"
                                    style={{ clipPath: "inset(0 0 0 50%)" }}
                                    alt="Token2" />
                            </div>
                            <AvatarFallback>T</AvatarFallback>
                        </Avatar>
                        <div>{transactions[0]?.pool_id.name}</div>
                    </div>
                </>}
            </div>
            <div className="w-full">
                <PoolChart />
            </div>
            <div className="flex flex-col w-full">
                <p>Transactions</p>
                {!isFetchingTransaction && transactions &&
                    <PoolTransactions transactions={transactions} />
                }
            </div>
        </div>
    )
}