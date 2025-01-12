'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { ArrowDownTrayIcon, TagIcon } from "@heroicons/react/20/solid";
import { ArrowsUpDownIcon, ArrowsRightLeftIcon, ArrowDownCircleIcon } from '@heroicons/react/20/solid'
import { calculateElapsedTime } from "@/utils/calculateElapsedTime"
import { NFTActiveTransaction } from "@/lib/type"

interface Props {
    actives: NFTActiveTransaction[] | [],
}

const options = ['Event', 'Price', 'From', 'To', 'Date']
export default function ItemActivity({ actives }: Props) {

    return (
        <Card className="rounded-2xl my-0">
            <CardHeader className="my-0 py-4 rounded-t-2xl text-md font-semibold border-b-[1px]">
                <CardTitle className="flex flex-row space-x-2">
                    <ArrowsUpDownIcon className="w-4 h-4" />
                    <div>Item Activity</div>
                </CardTitle>
            </CardHeader>
            {actives.length ?
                <CardContent className="my-0 p-0">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between items-center px-4 py-2 text-sm font-semibold opacity-75">
                            <div className="flex flex-row justify-start w-[20%]">{options[0]}</div>
                            <div className="flex flex-row justify-start w-[20%]">{options[1]}</div>
                            <div className="flex flex-row justify-start w-[20%]">{options[2]}</div>
                            <div className="flex flex-row justify-start w-[20%]">{options[3]}</div>
                            <div className="flex flex-row justify-start w-[20%]">{options[4]}</div>
                        </div>
                        {actives && actives.map((item, index) => {
                            const type = item.type.split(" ")[0]
                            let Event = ArrowsRightLeftIcon
                            if (type === 'Listed') {
                                Event = TagIcon
                            }
                            if (type === 'Buy') {
                                Event = ShoppingCartIcon
                            }
                            if (type === 'Withdraw') {
                                Event = ArrowDownCircleIcon
                            }
                            if (type === 'Receive') {
                                Event = ArrowDownTrayIcon
                            }
                            return (<div key={index} className={`hover:bg-secondary/80 cursor-pointer flex flex-row justify-between items-center border-t-[1px] px-4 py-3 ${index === actives.length - 1 ? 'rounded-b-2xl' : ''}`}>
                                <div className="flex flex-row justify-start items-center w-[20%] space-x-3">
                                    <Event className="w-4 h-4" />
                                    <div>
                                        {item.type.split(" ")[0] === 'Receive' ? item.type : item.type.split(" ")[0]}
                                    </div>
                                </div>
                                <div className="flex flex-row justify-start w-[20%] text-md font-semibold">{type !== 'Transfer' ? `${item.price?.slice(0, item.price.indexOf('.') + 4)} ETH` : ''}</div>
                                <div className="flex flex-row justify-start w-[20%] text-blue-600">{item.from_wallet.slice(2, 8) ?? ''}</div>
                                <div className="flex flex-row justify-start w-[20%] text-blue-600">{item.to_wallet?.slice(2, 8) ?? ''}</div>
                                <div className="flex flex-row justify-start w-[20%]">{calculateElapsedTime(item.createdAt)}</div>
                            </div>)
                        })}
                    </div>
                </CardContent>
                : <div className="flex flex-row justify-center items-center p-4">No Activity</div>
            }
        </Card>
    )
}