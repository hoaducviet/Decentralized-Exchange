'use client'
import { useGetTokensQuery } from "@/redux/features/api/apiSlice"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatPrice } from "@/utils/formatPrice"
import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons"

const options = ['#', 'Token', 'Price', '1 day', 'FDV', 'Volume']
export default function Tokens() {
    const { data: tokens } = useGetTokensQuery()
    return (
        <Card className="flex flex-col w-full rounded-2xl border-[1px] shadow-md">
            <div className="bg-secondary/80 hover:bg-secondary flex flex-row justify-between items-center text-md font-semibold rounded-t-2xl h-[3vw] px-4">
                <div className="w-[5%] flex flex-row justify-start items-center">{options[0]}</div>
                <div className="w-[20%] flex flex-row justify-start items-center">{options[1]}</div>
                <div className="w-[15%] flex flex-row justify-end items-center">{options[2]}</div>
                <div className="w-[15%] flex flex-row justify-end items-center">{options[3]}</div>
                <div className="w-[15%] flex flex-row justify-end items-center">{options[4]}</div>
                <div className="w-[15%] flex flex-row justify-end items-center">{options[5]}</div>
                <div className="w-[15%] flex flex-row justify-end items-center"></div>
            </div>
            <div className="flex flex-col max-h-[55vw] overflow-x-auto ">
                {tokens && tokens.map((token, index) => {
                    if (token.symbol === 'USD') return <div key={index}></div>
                    const percentChange = parseFloat(token.price_reference) > 0 ? (parseFloat(token.price) - parseFloat(token.price_reference)) / parseFloat(token.price_reference) : 0
                    return (
                        <div key={index}>
                            <Link href={`/explore/tokens/${token.symbol}`}>
                                <div className={`flex flex-row cursor-pointer hover:bg-secondary/80 dark:hover:bg-white/5 text-md font-medium items-center h-[3.5vw] w-full px-4 border-t-[0.2px] border-gray-300 border-opacity-20 ${index === tokens.length - 1 ? 'rounded-b-2xl' : ''}`} >
                                    <p className="w-[5%] flex flex-row justify-start items-center">{index + 1}</p>
                                    <div className="w-[20%] flex flex-row justify-start items-center space-x-[0.3vw] font-semibold">
                                        <Avatar className="w-[1.5vw] h-[1.5vw]">
                                            <AvatarImage src={token.img} />
                                            <AvatarFallback>T</AvatarFallback>
                                        </Avatar>
                                        <p>{token.name}</p>
                                        <p className="opacity-60">{token.symbol}</p>
                                    </div>
                                    <p className="w-[15%] flex flex-row justify-end items-center">${(parseFloat(token.price)).toFixed(2)}</p>
                                    <div className="w-[15%] flex flex-row justify-end items-center">{percentChange >= 0 ?
                                        <div className="text-green-600 flex flex-row justify-end items-center space-x-[0.1vw]">
                                            <TriangleUpIcon className="w-[1.5vw] h-[1.5vw]" />
                                            <p>
                                                {percentChange.toFixed(2)}%
                                            </p>
                                        </div> : <div className="text-red-500 flex flex-row justify-end items-center space-x-[0.1vw]">
                                            <TriangleDownIcon className="w-[1.5vw] h-[1.5vw]" />
                                            <p>
                                                {(0 - percentChange).toFixed(2)}%
                                            </p>
                                        </div>
                                    }</div>
                                    <p className="w-[15%] flex flex-row justify-end items-center">${formatPrice((parseFloat(token.total_supply) * parseFloat(token.price)))}</p>
                                    <p className="w-[15%] flex flex-row justify-end items-center">${formatPrice(parseFloat(token.volume))}</p>
                                    <p className="w-[15%] flex flex-row justify-end items-center"></p>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}