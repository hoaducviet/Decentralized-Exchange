'use client'
import { useState } from "react";
import { useBalances } from "@/hooks/useBalances"
import PoolBalances from "@/components/exchange/PoolBalances";

import Link from "next/link";

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
    const [isActive, setIsActive] = useState<number>(0)
    const { liquidBalances } = useBalances();
    const LPbalances = liquidBalances.filter(liquidBalance => liquidBalance.balance?.value !== 0)
    return (
        <div className="w-full h-full">
            <div className="select-none flex flex-col justify-start items-center w-full h-full">
                <div className="flex flex-col justify-start items-center w-[50vw] m-[5vw]">
                    <div className="flex flex-row justify-between items-center w-full">
                        <p className="text-3xl font-semibold opacity-80">Add Liquidity</p>
                        <div className="flex flex-row justify-end w-[10vw] space-x-[0.1vw] mx-[1vw]">
                            {options.map((option, index) => {
                                return (
                                    <Link key={index} href={option.link}>
                                        <div onClick={() => setIsActive(index)} className={`cursor-pointer bg-secondary/80 hover:bg-secondary flex flex-row justify-center w-[5vw] ${isActive === index && 'bg-purple-100'}`}>{option.name}</div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                    <div className="flex w-full">
                        {children}
                    </div>
                    <div className="flex w-full">
                        <PoolBalances liquidBalances={LPbalances} />
                    </div>
                </div>
            </div >
        </div>
    )
}