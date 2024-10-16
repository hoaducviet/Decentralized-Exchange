'use client'
import { useState, useEffect } from 'react'
import SubmitItem from "@/components/exchange/SubmitItem"
import BuyItem from "@/components/exchange/BuyItem"
import { useWallet } from '@/hooks/useWallet'
import { BalancesType } from '@/lib/type';

export default function BuyBox() {
    const { balances, isLoaded } = useWallet();
    const [tokenOne, setTokenOne] = useState<BalancesType | undefined>(undefined);
    useEffect(() => {
        if (isLoaded) {
            setTokenOne(balances[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded])
    const tokenBalances = isLoaded ? balances.filter(tokenBalance => tokenBalance.token.address !== tokenOne?.token.address) : [];

    return (
        <div className="flex flex-col justify-center items-center">
            <BuyItem tokenBalance={tokenOne} tokenBalances={tokenBalances} setToken={setTokenOne} />
            <SubmitItem name="Buy" />
        </div>
    )
}