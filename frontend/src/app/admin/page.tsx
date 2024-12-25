'use client'
import Link from "next/link"
import useAuthCheck from "@/hooks/useAuthCheck"
import { useGetTokensQuery } from "@/redux/features/api/apiSlice"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatPrice } from "@/utils/formatPrice"
import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon, LinkIcon } from "@heroicons/react/24/outline"

const options = ['#', 'Token', 'Price', '1 day', 'FDV', 'Volume']
const list = ['Total', 'Add Token', 'Create Token']
export default function Admin() {
    useAuthCheck()
    const { data: tokens } = useGetTokensQuery()
    return (
        <div className="select-none flex flex-col justify-center items-center w-full  py-[2vw] space-y-[2vw]">
            <div className="flex flex-row w-full justify-between items-center pr-[4vw] text-white">
                <div className="flex flex-col justify-center items-start bg-blue-500 dark:bg-white/10 dark:border-white/40 border-y-[0.1px] border-r-[0.1px] w-[8vw] h-[3.5vw] pl-[1vw] rounded-r-full">
                    <p className="text-xl font-semibold">{list[0]}</p>
                    <p >{`${tokens?.length} Token`}</p>
                </div>
                <div className="flex flex-row justify-end items-center space-x-[1vw]">
                    <div className="cursor-pointer dark:bg-white/10 bg-blue-500 dark:border-white/40 hover:dark:border-blue-500 border-[0.1px] flex flex-row justify-end items-center rounded-2xl shadow-2xl space-x-2 h-[3vw] px-[1vw]">
                        <LinkIcon className="w-[1.5vw] h-[1.5vw]" />
                        <p className="font-semibold ">{list[1]}</p>
                    </div>
                    <div className="cursor-pointer dark:bg-white/10 bg-blue-500 dark:border-white/40 hover:dark:border-blue-500 border-[0.1px] flex flex-row justify-end items-center rounded-2xl shadow-md space-x-2 h-[3vw] px-[1vw]">
                        <PlusCircleIcon className="w-[1.5vw] h-[1.5vw]" />
                        <p className="font-semibold">{list[2]}</p>
                    </div>
                </div>
            </div>
            <div className="w-full px-[4vw]">
                <Card className=" flex flex-col w-full rounded-2xl border-[1px] shadow-md ">
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
                            const percentChange = (parseFloat(token.price) - parseFloat(token.price_reference)) / parseFloat(token.price_reference)
                            return (
                                <div key={index}>
                                    <div className={`flex flex-row cursor-pointer hover:bg-secondary/80 dark:hover:bg-white/5 text-md font-medium items-center h-[3.5vw] w-full px-4 border-t-[0.2px] border-gray-300 border-opacity-20 ${index === tokens.length - 1 ? 'rounded-b-2xl' : ''}`} >
                                        <p className="w-[5%] flex flex-row justify-start items-center">{index + 1}</p>
                                        <div className="w-[20%] flex flex-row justify-start items-center hover:underline">
                                            <Link href={`/explore/tokens/${token.symbol}`} className="flex flex-row justify-start items-center space-x-[0.3vw] font-semibold">
                                                <Avatar className="w-[1.5vw] h-[1.5vw]">
                                                    <AvatarImage src={token.img} />
                                                    <AvatarFallback>T</AvatarFallback>
                                                </Avatar>
                                                <p>{token.name}</p>
                                                <p className="opacity-60">{token.symbol}</p>
                                            </Link>
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
                                        <div className="w-[15%] flex flex-row justify-end items-center">
                                            <Button variant='outline'>Delete</Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            </div>
        </div>
    )
}