'use client'
import { useState } from "react";
import { useAccount } from "wagmi";
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetLiquidityBalancesQuery } from "@/redux/features/api/apiSlice";
import Link from "next/link";
import PoolBalances from "@/components/exchange/PoolBalances";

const options = [
    {
        name: 'Tokens',
        link: '/pool'
    },
    {
        name: 'USD',
        link: '/pool/usd'
    }
]

export default function PoolLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { address } = useAccount()
    const [isActive, setIsActive] = useState<number>(0)
    const { data: liquidBalances, isFetching } = useGetLiquidityBalancesQuery(address ?? skipToken)
    const LPbalances = liquidBalances?.filter(liquidBalance => liquidBalance.balance?.value !== 0)
    return (
        <div className="w-full h-full">
            <div className="select-none flex flex-col justify-start items-center w-full h-full">
                <div className="flex flex-col justify-start items-center w-[50vw] m-[5vw]">
                    <div className="flex flex-row justify-between items-center w-full">
                        <p className="text-3xl font-semibold opacity-80">Add Liquidity</p>
                        <div className="flex flex-row justify-end w-[10vw] space-x-[0.1vw] mx-[1vw]">
                            {options.map((option, index) => {
                                return (
                                    <Link key={index} href={option.link} onClick={() => setIsActive(index)} className={`cursor-pointer  flex flex-row justify-center w-[5vw] ${isActive === index ? 'bg-purple-200' : ''}`}>
                                        {option.name}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                    <div className="flex w-full">
                        {children}
                    </div>
                    <div className="flex w-full">{!isFetching && LPbalances && <PoolBalances liquidBalances={LPbalances} />}
                    </div>
                </div>
            </div >
        </div>
    )
}