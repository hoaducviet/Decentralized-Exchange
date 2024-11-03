import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components//ui/tabs'
import BuyBox from '@/components/exchange/BuyBox'
import LimitBox from '@/components/exchange/LimitBox'
import SellBox from '@/components/exchange/SellBox'
import SwapBox from '@/components/exchange/SwapBox'
import TransferBox from '@/components/exchange/TransferBox'

export default function Swap() {
    return (
        <div className="flex flex-col items-center mt-[10vh] w-full h-full">
            <Tabs defaultValue="swap" className="flex flex-col justify-center w-[40%]">
                <TabsList className="flex flex-rol select-none justify-between w-full">
                    <TabsTrigger value="swap" className="w-[20%] h-full">Swap</TabsTrigger>
                    <TabsTrigger value="limit" className="w-[20%] h-full">Limit</TabsTrigger>
                    <TabsTrigger value="transfer" className="w-[20%] h-full">Transfer</TabsTrigger>
                    <TabsTrigger value="buy" className="w-[20%] h-full">Buy</TabsTrigger>
                    <TabsTrigger value="sell" className="w-[20%] h-full">Sell</TabsTrigger>
                </TabsList>
                <TabsContent value="swap" className="w-full"><SwapBox /></TabsContent>
                <TabsContent value="limit" className="w-full"><LimitBox /></TabsContent>
                <TabsContent value="transfer" className="w-full"><TransferBox /></TabsContent>
                <TabsContent value="buy" className="w-full"><BuyBox /></TabsContent>
                <TabsContent value="sell" className="w-full"><SellBox /></TabsContent>
            </Tabs>
        </div>
    )
}
