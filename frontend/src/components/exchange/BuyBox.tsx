'use client'
import { useState, useEffect } from 'react'
import SubmitItem from "@/components/exchange/SubmitItem"
import BuyItem from "@/components/exchange/BuyItem"
import { useBalances } from '@/hooks/useBalances'
import { TokenBalancesType } from '@/lib/type';

export default function BuyBox() {
    const { tokenBalances, isLoaded } = useBalances();
    const [tokenOne, setTokenOne] = useState<TokenBalancesType | undefined>(undefined);
    useEffect(() => {
        if (isLoaded) {
            setTokenOne(tokenBalances[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded])
    const balances = isLoaded ? tokenBalances.filter(tokenBalance => tokenBalance.info.address !== tokenOne?.info.address) : [];

    return (
        <div className="flex flex-col justify-center items-center">
            <BuyItem tokenBalance={tokenOne} tokenBalances={balances} setToken={setTokenOne} />
            <SubmitItem name="Buy" />
        </div>
    )
}