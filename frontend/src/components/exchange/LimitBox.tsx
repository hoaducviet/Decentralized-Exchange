'use client'
import SubmitItem from "@/components/exchange/SubmitItem"
import TimeItem from "@/components/exchange/TimeItem"
import TradeBoxItem from "@/components/exchange/TradeItem"
import LimitItem from "@/components/exchange/LimitItem"
import { Button } from "@/components/ui/button"
import { HeightIcon } from "@radix-ui/react-icons"
import tokenETH from "@/assets/token/tokenETH.json";
import { type Token } from '@/lib/type';

const eth: Token = tokenETH as Token;

export default function LimitBox() {

    return (
        <div className="flex flex-col w-full h-full">
            <LimitItem token={eth}/>
            <div className="relative flex flex-col w-full h-full">
                <TradeBoxItem title="Buy" />
                <TradeBoxItem title="Sell" isDisabled/>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-[10%] h-[10%]">
                    <Button variant="secondary" className="w-[full] h-full">
                        <HeightIcon className="w-full h-full" />
                    </Button>
                </div>
            </div>
            <TimeItem />
            <SubmitItem name="Confirm" />
        </div>
    )
}