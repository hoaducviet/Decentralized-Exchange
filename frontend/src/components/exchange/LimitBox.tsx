'use client'
import { useEffect, useState } from "react"
import SubmitItem from "@/components/exchange/SubmitItem"
import TimeItem from "@/components/exchange/TimeItem"
import TradeItem from "@/components/exchange/TradeItem"
import LimitItem from "@/components/exchange/LimitItem"
import { Button } from "@/components/ui/button"
import { HeightIcon } from "@radix-ui/react-icons"
import { useWallet } from '@/hooks/useWallet'
import { BalancesType } from '@/lib/type';

export default function LimitBox() {
    const { balances, isLoaded } = useWallet();
    const [tokenOne, setTokenOne] = useState<BalancesType | undefined>(undefined);
    const [tokenTwo, setTokenTwo] = useState<BalancesType | undefined>(undefined);

    useEffect(() => {
        if (isLoaded) {
            setTokenOne(balances[0])
            setTokenTwo(balances[1])
            console.log(balances[0], balances[1]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded])

    const tokenBalances = isLoaded ? balances.filter(tokenBalance => tokenBalance.token.address !== tokenOne?.token.address && tokenBalance.token.address !== tokenTwo?.token.address) : [];

    const handleSwitchTokens = () => {
        const one = tokenOne
        const two = tokenTwo
        setTokenOne(two)
        setTokenTwo(one)
    }

    return (
        <div className="flex flex-col w-full h-full">
            <LimitItem tokenOne={tokenOne} tokenTwo={tokenTwo} tokenBalances={tokenBalances} setTokenOne={setTokenOne} setTokenTwo={setTokenTwo}/>
            <div className="relative flex flex-col w-full h-full">
                <TradeItem title="Buy" tokenBalance={tokenOne} tokenBalances={tokenBalances} setToken={setTokenOne} />
                <TradeItem title="Sell" tokenBalance={tokenTwo} tokenBalances={tokenBalances} setToken={setTokenTwo} isDisabled />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-[10%] h-[10%]">
                    <Button onClick={handleSwitchTokens} variant="secondary" className="w-[full] h-full">
                        <HeightIcon className="w-full h-full" />
                    </Button>
                </div>
            </div>
            <TimeItem />
            <SubmitItem name="Confirm" />
        </div>
    )
}