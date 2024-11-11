'use client'
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useGetPoolsQuery } from "@/redux/features/api/apiSlice"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const options = ['#', 'Pool', 'TVL', 'APR', '1D vol', '7D vol', '1D/TVL']

export default function Pools() {
    const { data: pools } = useGetPoolsQuery()
    return (
        <div className="flex flex-col">
            <div className="bg-secondary flex flex-row justify-between items-center text-md font-semibold rounded-none px-3 h-[2vw]">
                <p className="w-[10%] flex flex-row justify-start items-center">{options[0]}</p>
                <p className="w-[25%] flex flex-row justify-start items-center">{options[1]}</p>
                <p className="w-[15%] flex flex-row justify-start items-center">{options[2]}</p>
                <p className="w-[15%] flex flex-row justify-start items-center">{options[3]}</p>
                <p className="w-[10%] flex flex-row justify-start items-center">{options[4]}</p>
                <p className="w-[10%] flex flex-row justify-end items-center">{options[5]}</p>
                <p className="w-[15%] flex flex-row justify-end items-center">{options[6]}</p>
            </div>
            <div className="flex flex-col w-full text-md font-semibold">
                {pools && pools.map((pool, index) => {
                    return (
                        <Link href={`/explore/pools/${pool.address}`}>
                            <div key={index} className="hover:bg-secondary/80 cursor-pointer flex flex-row items-center w-full h-[3.5vw] px-3">
                                <p className="font-medium w-[10%]">{index + 1}</p>
                                <div className=" w-[25%] flex flex-row justify-start items-center space-x-[0.3vw]">
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
                                <p className="flex flex-row justify-start w-[15%]">$111</p>
                                <p className="flex flex-row justify-start w-[15%]">1.5%</p>
                                <p className="flex flex-row justify-start w-[10%]">$1.5B</p>
                                <p className="flex flex-row justify-end w-[10%]">$1.5B</p>
                                <p className="flex flex-row justify-end w-[15%]">$1.5B</p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}