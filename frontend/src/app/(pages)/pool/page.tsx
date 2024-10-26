'use client'
import { useBalances } from "@/hooks/useBalances"
import PoolBox from "@/components/exchange/PoolBox";


export default function Pool() {
    const { tokenBalances, liquidBalances, isLoaded } = useBalances();
    const LPbalances = liquidBalances.filter(liquidBalance => liquidBalance.balance?.value !== 0)
    const balances = tokenBalances.filter(balance => balance.info.symbol !== 'USD')

    return (
        <div className="flex flex-col justify-start items-center w-full h-full">
            <PoolBox tokenBalances={balances} liquidBalances={LPbalances} isLoaded={isLoaded} />
        </div >
    )
}