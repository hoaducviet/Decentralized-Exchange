'use client'
import { useAccount } from "wagmi"
import { useGetCollectionsQuery, useGetNFTBalancesQuery } from "@/redux/features/api/apiSlice"
import { skipToken } from "@reduxjs/toolkit/query"
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import Image from 'next/image';
import Link from "next/link"

export default function NFTBalance() {
    const { address } = useAccount()
    const { data: nftBalances, isFetching } = useGetNFTBalancesQuery(address ?? skipToken)
    const { data: collections } = useGetCollectionsQuery()

    return (
        <div className=" flex flex-wrap flex-start gap-x-[1.6%] gap-y-[1vw]">
            {!isFetching && nftBalances && nftBalances.length ? <>{nftBalances?.map((nft, index) => {
                const collection = collections?.find(item => item._id === nft.collection_id)
                return (
                    <div key={index} className="cursor-pointer w-[23.8%]">
                        <Card className=' rounded-none shadow-md select-none w-full  p-0 m-0 space-y-0'>
                            <Link href={`/nfts/${collection?.name.toLowerCase().replace(/\s+/g, '')}/${nft.nft_id}`}>
                                <CardContent className=' w-full px-0 pb-[0.5vw] my-0'>
                                    <Image src={nft.img || '/image/default-nft.png'} priority={true} alt={nft.name || "nft"} width={200} height={200} className="object-cover w-full h-[5vw]" />
                                </CardContent>
                                <CardFooter className=" flex flex-col justify-center items-start text-xs pb-[0.5vw] px-0 my-0">
                                    <CardTitle className='opacity-70'>{nft.name ? nft.name : `${collection?.name} #${nft.nft_id}`}</CardTitle>
                                </CardFooter>
                            </Link>
                        </Card>
                    </div>
                )
            }
            )}</> : <div className="flex flex-row justify-center items-start w-full my-[2vw]">Not yet have nft!</div>
            }
        </div>
    )
}