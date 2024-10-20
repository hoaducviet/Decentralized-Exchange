'use client'
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTokens } from "@/hooks/useTokens"

export default function Pools() {
    const { tokens } = useTokens()
    return (
        <div className="flex flex-col w-full h-[3vw]">
            <Button variant="secondary" className="flex flex-row justify-start items-center text-md font-semibold rounded-none w-full h-full">
                <p className="w-[10%]">#</p>
                <p className="flex flex-row justify-start items-center w-[30%]">Pool</p>
                <p className="w-[20%]">TVL</p>
                <p className="w-[20%]">1D vol</p>
                <p className="w-[20%]">7D vol</p>
            </Button>
            <div className="flex flex-col w-full">
                {tokens.map((token, index) => {
                    return (
                        <div key={index} className="w-full h-[4vw]">
                            <Link href={`/explore/pools/${token.symbol}`}>
                                <Button variant="ghost" className="flex flex-row justify-start items-center rounded-none w-full h-full text-lg font-semibold">
                                    <p className="font-medium w-[10%]">{index + 1}</p>
                                    <div className=" flex flex-row justify-start items-center space-x-[0.3vw] w-[30%]">
                                        <Image src={token.img} alt={token.name} width={36} height={36} />
                                        <p>{token.name}</p>
                                        <p className="opacity-60">{token.symbol}</p>
                                    </div>
                                    <p className="opacity-70 w-[20%]">$111</p>
                                    <p className="opacity-70 w-[20%]">1.5%</p>
                                    <p className="opacity-70 w-[20%]">$1.5B</p>
                                </Button>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}