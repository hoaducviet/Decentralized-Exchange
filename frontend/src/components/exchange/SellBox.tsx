'use client'
import { useState, useEffect } from 'react'
import SubmitItem from "@/components/exchange/SubmitItem"
import SellItem from "@/components/exchange/SellItem"
import { useWallet } from '@/hooks/useWallet'
import { BalancesType } from '@/lib/type';

export default function SellBox() {
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
        <div className="flex flex-col select-none justify-center items-center">
            <SellItem tokenBalance={tokenOne} tokenBalances={tokenBalances} setToken={setTokenOne} />
            <SubmitItem name="Sell" />
        </div>
    )
}