'use client'
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import PoolChart from "@/components/chart/PoolChart"
import PoolTransactions from "@/components/explore/PoolTransactions"
import { useGetPoolReservePricesQuery, useGetPoolsQuery, useGetPoolTransactionsQuery } from '@/redux/features/api/apiSlice'
import { skipToken } from "@reduxjs/toolkit/query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowsRightLeftIcon } from "@heroicons/react/20/solid"
import { Pool as PoolType, Token } from "@/lib/type"
import { Button } from "@/components/ui/button"

export default function Pool() {
    const { pool } = useParams()
    const [switchToken, setSwitchToken] = useState<boolean>(false)
    const [token1, setToken1] = useState<Token | undefined>(undefined)
    const [token2, setToken2] = useState<Token | undefined>(undefined)
    const [currentPool, setCurrentPool] = useState<PoolType | undefined>(undefined)
    const { data: pools } = useGetPoolsQuery()
    const { data: transactions, isFetching: isFetchingTransaction } = useGetPoolTransactionsQuery(currentPool?._id ?? skipToken)
    const { data: reservePrices } = useGetPoolReservePricesQuery(currentPool?._id ?? skipToken)

    useEffect(() => {
        if (pools) {
            setCurrentPool(pools.find(item => item.address === pool))
        }
    }, [pools, pool])

    useEffect(() => {
        if (!switchToken) {
            setToken1(currentPool?.token1)
            setToken2(currentPool?.token2)
        } else {
            setToken1(currentPool?.token2)
            setToken2(currentPool?.token1)
        }
    }, [switchToken, currentPool])

    const handleSwitch = () => {
        setSwitchToken(!switchToken)
    }
    return (
        <div className="flex flex-col justify-center items-start mx-[15vw] my-[2vw]">
            <div className="flex flex-row justify-start text-2xl font-semibold">
                {currentPool && <>
                    <div className="flex flex-row justify-start items-center space-x-[0.5vw]">
                        <Avatar className="w-[2.5vw] h-[2.5vw] max-w-[5vw] border border-black">
                            <div className="realtive flex">
                                <AvatarImage src={token1?.img}
                                    className="absolute w-full h-full object-cover"
                                    style={{ clipPath: "inset(0 50% 0 0)" }}
                                    alt="Token1" />
                                <AvatarImage src={token2?.img}
                                    className="absolute w-full h-full object-cover"
                                    style={{ clipPath: "inset(0 0 0 50%)" }}
                                    alt="Token2" />
                            </div>
                            <AvatarFallback>T</AvatarFallback>
                        </Avatar>
                        <div>{`${token1?.symbol}/${token2?.symbol}`}</div>
                        <Button onClick={handleSwitch} variant='ghost'>
                            <ArrowsRightLeftIcon className="w-5 h-6" />
                        </Button>
                    </div>
                </>}
            </div>
            <div className="w-full">
                <PoolChart reserves={reservePrices ?? []} switchToken={switchToken} token1={token1} token2={token2} />
            </div>
            <div className="flex flex-col w-full space-y-[1vw]">
                <p className="flex flex-row justify-start items-center text-md font-semibold">Transactions</p>
                {!isFetchingTransaction && transactions &&
                    <PoolTransactions transactions={transactions ?? []} pool={currentPool} />
                }
            </div>
        </div>
    )
}