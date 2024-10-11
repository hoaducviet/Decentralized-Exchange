'use client'
import SubmitItem from "@/components/exchange/SubmitItem"
import TradeBoxItem from "@/components/exchange/TradeItem"
import { Button } from "@/components/ui/button"
import { HeightIcon } from "@radix-ui/react-icons"

export default function SwapBox() {


    return (
        <div className="flex flex-col w-full h-full">
            <div className="relative flex flex-col w-full h-full">
                <TradeBoxItem title="Buy" />
                <TradeBoxItem title="Sell" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-[10%] h-[10%]">
                    <Button variant="secondary" className="w-[full] h-full">
                        <HeightIcon className="w-full h-full" />
                    </Button>
                </div>
            </div>
            <SubmitItem name="Send" />
        </div>
    )
}