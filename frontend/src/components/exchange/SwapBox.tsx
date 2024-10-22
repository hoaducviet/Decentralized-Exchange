'use client'
import { useEffect, useState } from "react"
import SubmitItem from "@/components/exchange/SubmitItem"
import TradeItem from "@/components/exchange/TradeItem"
import { Button } from "@/components/ui/button"
import { HeightIcon } from "@radix-ui/react-icons"
import { useBalances } from '@/hooks/useBalances'
import { TokenBalancesType } from "@/lib/type"

export default function SwapBox() {
    const { tokenBalances, isLoaded } = useBalances();
    const [tokenOne, setTokenOne] = useState<TokenBalancesType | undefined>(undefined);
    const [tokenTwo, setTokenTwo] = useState<TokenBalancesType | undefined>(undefined);

    useEffect(() => {
        if (isLoaded) {
            setTokenOne(tokenBalances[0])
            setTokenTwo(tokenBalances[1])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded])

    const balances = isLoaded ? tokenBalances.filter(tokenBalance => tokenBalance.info.address !== tokenOne?.info.address && tokenBalance.info.address !== tokenTwo?.info.address) : [];

    const handleSwitchTokens = () => {
        const one = tokenOne
        const two = tokenTwo

        setTokenOne(two)
        setTokenTwo(one)
    }
    return (
        <div className="flex flex-col w-full h-full">
            <div className="relative flex flex-col w-full h-full">
                <TradeItem title="Buy" tokenBalance={tokenOne} tokenBalances={balances} setToken={setTokenOne} />
                <TradeItem title="Sell" tokenBalance={tokenTwo} tokenBalances={balances} setToken={setTokenTwo} isDisabled />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-[10%] h-[10%]">
                    <Button onClick={handleSwitchTokens} variant="secondary" className="w-[full] h-full">
                        <HeightIcon className="w-full h-full" />
                    </Button>
                </div>
            </div>
            <SubmitItem name="Send" />
        </div>
    )
}