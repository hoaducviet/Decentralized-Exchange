'use client'
import { useBalances } from "@/hooks/useBalances"
import PoolBoxUSD from "@/components/exchange/PoolBoxUSD"


export default function Pool() {
    const { tokenBalances, liquidBalances, isLoaded } = useBalances();
    const LPbalances = liquidBalances.filter(liquidBalance => liquidBalance.balance?.value !== 0)
    const usdBalances = tokenBalances.filter(balance => balance.info.symbol === 'USD' || balance.info.symbol === 'USDT' || balance.info.symbol === 'ETH')

    return (
        <div className="flex flex-col justify-start items-center w-full h-full">
            <PoolBoxUSD tokenBalances={usdBalances} liquidBalances={LPbalances} isLoaded={isLoaded} />
        </div >
    )
}