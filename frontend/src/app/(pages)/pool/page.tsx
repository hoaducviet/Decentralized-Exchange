'use client'
import { useBalances } from "@/hooks/useBalances"

import PoolBox from "@/components/exchange/PoolBox";
import PoolBalances from "@/components/exchange/PoolBalances";

export default function Pool() {
    const { tokenBalances, liquidBalances, isLoaded } = useBalances();
    const LPbalances = liquidBalances.filter(liquidBalance => liquidBalance.balance?.value !== 0)

    return (
        <div className=" flex flex-col justify-start items-center w-full h-full">
            <div className="flex flex-col justify-start items-center w-[50vw] m-[5vw]">
                <div className="flex flex-row justify-start items-center w-full">
                    <p className="text-3xl font-semibold opacity-80">Add Liquidity</p>
                </div>
                <div className="flex w-full">
                    <PoolBox tokenBalances={tokenBalances} liquidBalances={LPbalances} isLoaded={isLoaded} />
                </div>
                <div className="flex w-full">
                    <PoolBalances liquidBalances={LPbalances} />
                </div>
            </div>
        </div>
    )
}