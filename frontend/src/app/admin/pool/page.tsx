'use client'
import Link from "next/link"
import useAuthCheck from "@/hooks/useAuthCheck"
import { useGetPoolsQuery } from "@/redux/features/api/apiSlice"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatPrice } from "@/utils/formatPrice"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon, LinkIcon } from "@heroicons/react/24/outline"

const options = ['#', 'Pool', 'TVL', 'APR', '1D vol', '7D vol', '1D/TVL']
const list = ['Total', 'Pool', 'Create Pool']
export default function PoolAdmin() {
    useAuthCheck()
    const { data: pools } = useGetPoolsQuery()

    return (
        <div className="select-none flex flex-col justify-center items-center w-full  py-[2vw] space-y-[2vw]">
            <div className="flex flex-row w-full justify-between items-center pr-[4vw] text-white">
                <div className="flex flex-col justify-center items-start bg-blue-500 dark:bg-white/10 dark:border-white/40 border-y-[0.1px] border-r-[0.1px] w-[8vw] h-[3.5vw] pl-[1vw] rounded-r-full">
                    <p className="text-xl font-semibold">{list[0]}</p>
                    <p >{`${pools?.length} Pools`}</p>
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
                <Card className="flex flex-col w-full rounded-2xl border-[1px] shadow-md h-[79vh] overflow-y-auto">
                    <div className="w-full">
                        <div className="bg-secondary/80 hover:bg-secondary flex flex-row justify-between items-center text-md font-semibold rounded-t-2xl h-[3vw] px-4">
                            <p className="w-[5%] flex flex-row justify-start items-center">{options[0]}</p>
                            <p className="w-[20%] flex flex-row justify-start items-center">{options[1]}</p>
                            <p className="w-[15%] flex flex-row justify-start items-center">{options[2]}</p>
                            <p className="w-[15%] flex flex-row justify-start items-center">{options[3]}</p>
                            <p className="w-[10%] flex flex-row justify-start items-center">{options[4]}</p>
                            <p className="w-[10%] flex flex-row justify-end items-center">{options[5]}</p>
                            <p className="w-[15%] flex flex-row justify-end items-center">{options[6]}</p>
                            <p className="w-[10%] flex flex-row justify-end items-center"></p>
                        </div>
                    </div>
                    <div className="flex flex-col overflow-x-hidden">
                        {pools && pools.map((pool, index) => {
                            const ARP = parseFloat(pool.volume_day) * 0.1 / parseFloat(pool.total_tvl) * 365
                            return (
                                <div key={index} className={`flex flex-row cursor-pointer hover:bg-secondary/80 dark:hover:bg-white/5 text-md font-medium items-center h-[3.5vw] w-full px-4 border-t-[0.2px] border-gray-300 border-opacity-20 ${index === pools.length - 1 ? 'rounded-b-2xl' : ''}`} >
                                    <p className="font-medium w-[5%]">{index + 1}</p>
                                    <div className=" w-[20%] flex flex-row justify-start items-center space-x-[0.3vw] h-[3.5vw] font-semibold">
                                        <Link href={`/explore/pools/${pool.address}`} className="flex flex-row justify-start items-center space-x-[0.3vw] font-semibold hover:underline">
                                            <Avatar className="w-[1.5vw] h-[1.5vw] max-w-[5vw] border border-black">
                                                <div className="realtive flex">
                                                    <AvatarImage src={pool.token1.img}
                                                        className="absolute w-full h-full object-cover"
                                                        style={{ clipPath: "inset(0 50% 0 0)" }}
                                                        alt="Token1" />
                                                    <AvatarImage src={pool.token2.img}
                                                        className="absolute w-full h-full object-cover"
                                                        style={{ clipPath: "inset(0 0 0 50%)" }}
                                                        alt="Token2" />
                                                </div>
                                                <AvatarFallback>T</AvatarFallback>
                                            </Avatar>
                                            <div>{pool.name}</div>
                                        </Link>
                                    </div>
                                    <p className="flex flex-row justify-start w-[15%]">{`$${formatPrice(parseFloat(pool.total_tvl))}`}</p>
                                    <p className="flex flex-row justify-start w-[15%]">{`${ARP.toFixed(2)}%`}</p>
                                    <p className="flex flex-row justify-start w-[10%]">{`$${formatPrice(parseFloat(pool.volume_day))}`}</p>
                                    <p className="flex flex-row justify-end w-[10%]">{`$${formatPrice(parseFloat(pool.volume_week))}`}</p>
                                    <p className="flex flex-row justify-end w-[15%]">{`$${formatPrice(parseFloat(pool.tvl_day))}`}</p>
                                    <div className="flex flex-row justify-end w-[10%]"><Button variant="outline">Delete</Button></div>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            </div>
        </div>
    )
}