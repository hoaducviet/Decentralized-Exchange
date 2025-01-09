'use client'
import { useCollection } from "@/hooks/useCollection"
import { useGetNFTByCollectionQuery } from "@/redux/features/api/apiSlice"
import { skipToken } from "@reduxjs/toolkit/query";
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function CollectionNFTAdmin() {
    const { currentCollection } = useCollection()
    const { data: nfts } = useGetNFTByCollectionQuery(currentCollection?._id ?? skipToken)

    return (
        <div className="flex flex-col max-h-[70vh]">
            <div className="flex flex-wrap flex-start gap-x-[1.5%] gap-y-[1vw]">
                {nfts?.length && nfts.map((nft, index) => {
                    return (
                        <div key={index} className="w-[18.8%]">
                            <Dialog>
                                <DialogTrigger className="flex flex-row justify-around items-center w-full h-full">
                                    <Card className='border-none outline-none select-none w-full px-0 mx-0'>
                                        <CardContent className='cursor-pointer w-full px-0'>
                                            <Image src={nft.img || '/image/default-nft.png'} priority={true} alt={nft.name || "nft"} width={200} height={200} className="object-cover w-full h-full" />
                                        </CardContent>
                                        <CardFooter className="flex flex-col justify-center items-center space-y-[0.5vw] h-[4vw]">
                                            <CardTitle className='opacity-70'>{nft.name ? nft.name : `#${nft.nft_id}`}</CardTitle>
                                            <div className="flex flex-row justify-center items-center w-full space-x-1">
                                                <p className='text-md'>{nft.formatted}</p>
                                                <p className='text-md font-semibold'>ETH</p>
                                            </div>
                                        </CardFooter >
                                    </Card >
                                </DialogTrigger>
                                <DialogContent className="bg-transparent max-w-[50vw] max-h-[60vw] p-0 m-0 rounded-2xl border-none">
                                    <Image src={nft.img || '/image/default-nft.png'} priority={true} alt={nft.name || "nft"} width={200} height={200} className="object-cover w-full h-full rounded-2xl" />
                                </DialogContent>
                            </Dialog>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}