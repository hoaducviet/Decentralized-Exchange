'use client'
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useGetLiquidityBalancesQuery } from "@/redux/features/api/apiSlice";
import PoolBalances from "@/components/exchange/PoolBalances";
import Link from "next/link";
import { skipToken } from '@reduxjs/toolkit/query/react';

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
    const path = usePathname()
    const [isActive, setIsActive] = useState<number | undefined>(undefined)
    const { data: liquidBalances, isFetching } = useGetLiquidityBalancesQuery(address ?? skipToken)
    const LPbalances = liquidBalances?.filter(liquidBalance => liquidBalance.balance?.value !== "0")

    useEffect(() => {
        if (path.includes('/usd')) {
            setIsActive(1)
        } else { setIsActive(0) }
    }, [path])

    return (
        <div className="select-none flex flex-col justify-start items-center w-full h-full px-[25vw] m-[2vw]">
            <div className="flex flex-row justify-between items-center w-full">
                <p className="text-3xl font-semibold opacity-80">Add Liquidity</p>
                <div className="flex flex-row justify-end w-[10vw] space-x-[0.1vw] mx-[1vw]">
                    {options.map((option, index) => {
                        return (
                            <Link key={index} href={option.link} onClick={() => setIsActive(index)} className={`cursor-pointer  flex flex-row justify-center w-[5vw] ${isActive === index ? 'bg-purple-200 dark:bg-white/20' : ''}`}>
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
        </div >
    )
}