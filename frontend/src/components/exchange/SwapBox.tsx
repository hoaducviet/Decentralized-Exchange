'use client'
import SubmitItem from "@/components/exchange/SubmitItem"
import TradeBoxItem from "@/components/exchange/TradeItem"
import { Button } from "@/components/ui/button"
import { HeightIcon } from "@radix-ui/react-icons"

export default function SwapBox() {


    return (
        <div className="relative flex flex-col w-full h-full">
            <TradeBoxItem title="Buy" />
            <TradeBoxItem title="Sell" />
            <SubmitItem name="Send" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[100%]">
                <Button variant="secondary">
                    <HeightIcon className="w-[2vw] h-[2vw]" />
                </Button>
            </div>
        </div>
    )
}