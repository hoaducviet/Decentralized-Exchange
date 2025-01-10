'use client'
import { useCollection } from "@/hooks/useCollection"
import { useGetNFTByPendingCollectionQuery, useGetPendingNFTItemQuery } from "@/redux/features/api/apiSlice"
import { skipToken } from "@reduxjs/toolkit/query";
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react";
import { PendingNFT } from "@/lib/type";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


const options = [
    {
        name: 'Item'
    },
    {
        name: 'AI Price'
    },
    {
        name: 'Expert Price'
    },
    {
        name: 'Price'
    },
]
const infoNft = [
    'Collection',
    'NFT ID',
    'AI Price',
    'Expert Price',
    'Price',
    'Created At'
]

export default function CollectionNFTAdmin() {
    const { currentPendingCollection } = useCollection()
    const { data: nfts } = useGetNFTByPendingCollectionQuery(currentPendingCollection?._id ?? skipToken)
    const [currentNft, setCurrentNft] = useState<PendingNFT | undefined>(undefined)
    const { data: nowNft } = useGetPendingNFTItemQuery(currentPendingCollection?._id && currentNft ? { collectionId: currentPendingCollection?._id as string, nftId: currentNft.nft_id as string } : skipToken)

    const handleSetCurrentNft = (nft: PendingNFT) => {
        setCurrentNft(nft)
    }
    console.log(nfts)

    return (
        <div className="select-none flex flex-col max-h-[70vh] space-y-[1vw] px-[10vw]">
            <div className="flex flex-row justify-between items-center text-sm font-semibold opacity-60 h-[3vw] px-[5vw]">
                {options.map((option, index) => {
                    return <div key={index} className="flex flex-row justify-start items-center w-[25%]">
                        {option.name}
                    </div>
                })}
            </div>
            <div className="flex flex-col flex-start border-t-[1px] px-[5vw]">
                {nfts?.length && nfts.map((nft, index) => {
                    return (
                        <div key={index} className="flex flex-row justify-between items-center w-full hover:bg-secondary/80 py-[0.5vw]">
                            <Dialog >
                                <DialogTrigger className="flex justify-around items-center h-full w-full" onClick={() => handleSetCurrentNft(nft)}>
                                    <div className='hover:underline flex flex-row border-none outline-none select-none w-full px-0 mx-0'>
                                        <div className="flex flex-row justify-start items-center w-[25%] h-full space-x-[0.5vw]">
                                            <Image src={nft.img || '/image/default-nft.png'} priority={true} alt={nft.name || "nft"} width={25} height={25} className="object-cover rounded-xl h-[4vw] w-[4vw]" />
                                            <div>{nft.name ? nft.name : `#${nft.nft_id}`}</div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center space-x-[0.4vw] w-[25%]">
                                            <p>{parseFloat(nft.ai_price) > 0 ? nft.ai_price : ""}</p>
                                            <p className="text-md font-semibold">ETH</p>
                                        </div>
                                        <div className="flex flex-row justify-start items-center space-x-[0.4vw] w-[25%]">
                                            <p>{parseFloat(nft.expert_price) > 0 ? nft.expert_price : ""}</p>
                                            <p className="text-md font-semibold">ETH</p>
                                        </div>
                                        <div className="flex flex-row justify-start items-center space-x-[0.4vw] w-[25%]">
                                            <p>{parseFloat(nft.price) > 0 ? nft.price : ""}</p>
                                            <p className="text-md font-semibold">ETH</p>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="select-none bg-transparent max-w-[70vw] max-h-[70vw] p-0 m-0 rounded-2xl border-none">
                                    <DialogHeader>
                                        <VisuallyHidden>
                                            <DialogTitle>Pending NFT</DialogTitle>
                                            <DialogDescription>{nft.description}</DialogDescription>
                                        </VisuallyHidden>
                                    </DialogHeader>
                                    <div className="flex flex-row w-full space-x-[1vw]">
                                        <div className="flex flex-col w-[30%] bg-white/10 rounded-2xl text-white px-3 py-[2vw] space-y-[1vw]">
                                            <div className="flex flex-col justify-center items-center">
                                                <p className="text-xl font-semibold">{nowNft?.name ? nowNft.name : `${currentPendingCollection?.name} #${nft.nft_id}`}</p>
                                            </div>
                                            <div className="flex flex-col justify-center items-center border-t-[0.1px] py-[0.5vw] space-y-[0.4vw]">
                                                <div className="flex flex-row justify-between w-full items-center">
                                                    <p className="font-semibold">{infoNft[0]}</p>
                                                    <p>{currentPendingCollection?.name}</p>
                                                </div>
                                                <div className="flex flex-row justify-between w-full items-center">
                                                    <p className="font-semibold">{infoNft[1]}</p>
                                                    <p>{nowNft?.nft_id}</p>
                                                </div>
                                                <div className="flex flex-row justify-between w-full items-center">
                                                    <p className="font-semibold">{infoNft[2]}</p>
                                                    <div className="flex flex-row space-x-1">
                                                        <p>{nowNft?.ai_price}</p>
                                                        <p>{currentPendingCollection?.currency}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-between w-full items-center">
                                                    <p className="font-semibold">{infoNft[3]}</p>
                                                    <div className="flex flex-row space-x-1">
                                                        <p>{nowNft?.expert_price}</p>
                                                        <p>{currentPendingCollection?.currency}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-between w-full items-center">
                                                    <p className="font-semibold">{infoNft[4]}</p>
                                                    <div className="flex flex-row space-x-1">
                                                        <p>{nowNft?.price}</p>
                                                        <p>{currentPendingCollection?.currency}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-between w-full items-center">
                                                    <p className="font-semibold">{infoNft[5]}</p>
                                                    <div className="flex flex-row space-x-1 italic">
                                                        <p>{(new Date(nowNft?.createdAt || '')).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-1 border-t-[0.1px] py-[0.5vw]">
                                                <p className="text-md font-semibold">Traits</p>
                                                <div className="flex flex-wrap justify-between gap-y-2 gap-x-1 border-[1px] border-white/40 rounded-2xl p-2">
                                                    {nowNft?.traits && nowNft.traits.length > 0 && nowNft.traits.map((item, index) => {
                                                        return (
                                                            <div className="bg-white/15 w-[49%] flex flex-col justify-center items-center rounded-2xl py-[0.5vw]" key={index}>
                                                                <p className="text-lg font-semibold">{item.trait_type}</p>
                                                                <p>{item.value}</p>
                                                            </div>)
                                                    })}
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-1 border-t-[0.1px] py-[0.5vw]">
                                                <p className="text-md font-semibold">Description</p>
                                                <div className="flex border-[1px] text-sm text-wrap border-white/40 rounded-2xl p-3 max-h-[20vh] min-h-[15vh]">
                                                    {nowNft?.description}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-row w-[70%]">
                                            <Image src={nft.img || '/image/default-nft.png'} priority={true} alt={nft.name || "nft"} width={200} height={200} className="object-cover w-full h-full rounded-2xl" />
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}