'use client'
import { useState, useEffect } from 'react'
import SubmitItem from "@/components/exchange/SubmitItem"
import SellItem from "@/components/exchange/SellItem"
import { useBalances } from '@/hooks/useBalances'
import { TokenBalancesType } from '@/lib/type';

export default function SellBox() {
    const { tokenBalances, isLoaded } = useBalances();
    const [tokenOne, setTokenOne] = useState<TokenBalancesType | undefined>(undefined);
    const tokensbalances = tokenBalances.filter(tokenBalance => tokenBalance.info.symbol === 'ETH' || tokenBalance.info.symbol === 'USDT')

    useEffect(() => {
        if (isLoaded) {
            setTokenOne(tokenBalances[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded])
    const balances = isLoaded ? tokensbalances.filter(tokenBalance => tokenBalance.info.address !== tokenOne?.info.address) : [];

    return (
        <div className="flex flex-col select-none justify-center items-center">
            <SellItem tokenBalance={tokenOne} tokenBalances={balances} setToken={setTokenOne} />
            <SubmitItem name="Sell" />
        </div>
    )
}