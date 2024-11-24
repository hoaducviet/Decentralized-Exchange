'use client'
import { useGetTokensQuery } from "@/redux/features/api/apiSlice"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const options = ['#', 'Token', 'Price', 'Volume']

export default function Tokens() {
    const { data: tokens } = useGetTokensQuery()
    console.log(tokens)
    return (
        <div className="flex flex-col w-full">
            <div className="bg-secondary/80 hover:bg-secondary flex flex-row justify-between items-center text-md font-semibold rounded-none h-[2vw] px-3">
                <div className="w-[10%] flex flex-row justify-start items-center">{options[0]}</div>
                <div className="w-[30%] flex flex-row justify-start items-center">{options[1]}</div>
                <div className="w-[15%] flex flex-row justify-start items-center">{options[2]}</div>
                <div className="w-[15%] flex flex-row justify-start items-center">{options[3]}</div>
                <div className="w-[30%] flex flex-row justify-end items-center"></div>
            </div>
            <div className="flex flex-col max-h-[50vw] overflow-x-auto">
                {tokens && tokens.map((token, index) => {
                    if (token.symbol === 'USD') return <></>
                    return (
                        <div key={index}>
                            <Link href={`/explore/tokens/${token.symbol}`}>
                                <div className="flex flex-row cursor-pointer hover:bg-secondary/80 text-md font-semibold items-center h-[3.5vw] w-full px-3" >
                                    <p className="w-[10%] flex flex-row justify-start items-center">{index + 1}</p>
                                    <div className="w-[30%] flex flex-row justify-start items-center space-x-[0.3vw]">
                                        <Avatar className="w-[1.5vw] h-[1.5vw]">
                                            <AvatarImage src={token.img} />
                                            <AvatarFallback>T</AvatarFallback>
                                        </Avatar>
                                        <p>{token.name}</p>
                                        <p className="opacity-60">{token.symbol}</p>
                                    </div>
                                    <p className="w-[15%] justify-start items-center">$ {token.price.slice(0, token.price.indexOf('.') + 5)}</p>
                                    <p className="w-[15%] justify-start items-center">{token.volume}</p>
                                    <p className="w-[30%] justify-end items-center"></p>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}