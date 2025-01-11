'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TagIcon } from "@heroicons/react/20/solid";
import { calculateElapsedTime } from "@/utils/calculateElapsedTime"
import { NFTActiveTransaction, ReservePool } from "@/lib/type"

interface Props {
    listed: NFTActiveTransaction[] | [];
    UsdEth: ReservePool | undefined;
} 

const options = ['Price', 'USD Price', 'Quantity', 'Expiration', 'From', '']
export default function ItemListings({ listed, UsdEth }: Props) {
 
    return (
        <Card className="rounded-2xl my-0">
            <CardHeader className="my-0 py-4 rounded-t-2xl text-md font-semibold border-b-[1px]">
                <CardTitle className="flex flex-row space-x-2">
                    <TagIcon className="w-4 h-4" />
                    <div>Listings</div>
                </CardTitle>
            </CardHeader>
            {listed.length ?
                <CardContent className="my-0 p-0 rounded-b-2xl">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between items-center px-4 py-2 text-sm font-semibold opacity-75">
                            <div className="flex flex-row justify-start w-[20%]">{options[0]}</div>
                            <div className="flex flex-row justify-start w-[20%]">{options[1]}</div>
                            <div className="flex flex-row justify-start w-[20%]">{options[2]}</div>
                            <div className="flex flex-row justify-start w-[20%]">{options[3]}</div>
                            <div className="flex flex-row justify-start w-[20%]">{options[4]}</div>
                            {/* <div className="flex flex-row justify-center w-[20%]">{optionListings[5]}</div> */}
                        </div>
                        {listed && listed.map((item, index) => {
                            const usdPrice = (parseFloat(item.price || '0') * parseFloat(UsdEth?.reserve1 || '0') / parseFloat(UsdEth?.reserve2 || '0')).toString()
                            return (<div key={index} className={`hover:bg-secondary/80 cursor-pointer flex flex-row justify-between items-center border-t-[1px] px-4 py-3 ${index === listed.length - 1 ? 'rounded-b-2xl' : ''}`}>
                                <div className="flex flex-row justify-start w-[20%] text-md font-semibold">{item.price?.slice(0, item.price.indexOf('.') + 4)} ETH</div>
                                <div className="flex flex-row justify-start w-[20%]">$ {usdPrice.slice(0, usdPrice.indexOf('.') + 3)}</div>
                                <div className="flex flex-row justify-start w-[20%]">{1}</div>
                                <div className="flex flex-row justify-start w-[20%]">{calculateElapsedTime(item.createdAt)}</div>
                                <div className="flex flex-row justify-start w-[20%] text-blue-600">{`${item.from_wallet.slice(2, 8)}...`}</div>
                                {/* <div className="flex flex-row justify-center w-[20%]"><Button className="bg-blue-500 hover:bg-blue-600">Buy</Button></div> */}
                            </div>)
                        })}
                    </div>
                </CardContent>
                : <div className="flex flex-row justify-center items-center p-4">No Listings</div>
            }
        </Card>
    )
}