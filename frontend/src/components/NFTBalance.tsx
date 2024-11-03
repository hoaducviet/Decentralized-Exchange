'use client'
import { useAccount } from "wagmi"
import { useGetNFTBalancesQuery } from "@/redux/features/api/apiSlice"
import { skipToken } from "@reduxjs/toolkit/query"
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import Image from 'next/image';

export default function NFTBalance() {
    const { address } = useAccount()
    const { data: nftBalances, isFetching } = useGetNFTBalancesQuery(address ?? skipToken)

    return (
        <div className=" flex flex-wrap flex-start gap-x-[1.6%] gap-y-[1vw]">
            {!isFetching && nftBalances?.map((nft, index) => {
                return (
                    <div key={index} className=" cursor-pointer w-[23.8%]">
                        <Card className='border-none outline-none rounded-none shadow-sm select-none w-full  p-0 m-0 space-y-0'>
                            <CardContent className=' w-full px-0 pb-[0.5vw] my-0'>
                                <Image src={nft.img || '/image/default-nft.png'} alt={nft.name || "nft"} width={200} height={200} className="object-cover w-full h-[5vw]" />
                            </CardContent>
                            <CardFooter className=" flex flex-col justify-center items-start text-xs pb-[0.5vw] my-0">
                                <CardTitle className='opacity-70'>{nft.name} # {nft.id}</CardTitle>
                            </CardFooter>
                        </Card>
                    </div>
                )
            }
            )}
        </div>
    )
}