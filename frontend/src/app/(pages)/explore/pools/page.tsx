'use client'
import Link from "next/link"
import { useGetPoolsQuery } from "@/redux/features/api/apiSlice"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatPrice } from "@/utils/formatPrice"
import { Card } from "@/components/ui/card"

const options = ['#', 'Pool', 'TVL', 'APR', '1D vol', '7D vol', '1D/TVL']

export default function Pools() {
    const { data: pools } = useGetPoolsQuery()

    return (
        <Card className="flex flex-col w-full rounded-2xl border-[1px] shadow-md">
            <div className="bg-secondary/80 hover:bg-secondary flex flex-row justify-between items-center text-md font-semibold rounded-t-2xl h-[3vw] px-4">
                <p className="w-[10%] flex flex-row justify-start items-center">{options[0]}</p>
                <p className="w-[25%] flex flex-row justify-start items-center">{options[1]}</p>
                <p className="w-[15%] flex flex-row justify-start items-center">{options[2]}</p>
                <p className="w-[15%] flex flex-row justify-start items-center">{options[3]}</p>
                <p className="w-[10%] flex flex-row justify-start items-center">{options[4]}</p>
                <p className="w-[10%] flex flex-row justify-end items-center">{options[5]}</p>
                <p className="w-[15%] flex flex-row justify-end items-center">{options[6]}</p>
            </div>
            <div className="flex flex-col max-h-[55vw] overflow-x-auto ">
                {pools && pools.map((pool, index) => {
                    const ARP = parseFloat(pool.volume_day) > 0 ? parseFloat(pool.volume_day) * 0.1 / parseFloat(pool.total_tvl) * 365 : 0
                    return (
                        <Link key={index} href={`/explore/pools/${pool.address}`}>
                            <div className={`flex flex-row cursor-pointer hover:bg-secondary/80 dark:hover:bg-white/5 text-md font-medium items-center h-[3.5vw] w-full px-4 border-t-[0.2px] border-gray-300 border-opacity-20 ${index === pools.length - 1 ? 'rounded-b-2xl' : ''}`} >
                                <p className="font-medium w-[10%]">{index + 1}</p>
                                <div className=" w-[25%] flex flex-row justify-start items-center space-x-[0.3vw] font-semibold">
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
                                </div>
                                <p className="flex flex-row justify-start w-[15%]">{`$${formatPrice(parseFloat(pool.total_tvl))}`}</p>
                                <p className="flex flex-row justify-start w-[15%]">{`${ARP.toFixed(2)}%`}</p>
                                <p className="flex flex-row justify-start w-[10%]">{`$${formatPrice(parseFloat(pool.volume_day))}`}</p>
                                <p className="flex flex-row justify-end w-[10%]">{`$${formatPrice(parseFloat(pool.volume_week))}`}</p>
                                <p className="flex flex-row justify-end w-[15%]">{`$${formatPrice(parseFloat(pool.tvl_day))}`}</p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </Card>
    )
}