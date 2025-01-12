'use client'
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Children, NFTActiveTransaction } from "@/lib/type"
import Image from "next/image";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetNFTItemQuery } from "@/redux/features/api/apiSlice";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
    children: Children;
    transaction: NFTActiveTransaction;
}

export default function NFTTransactionOverview({ children, transaction }: Props) {
    const [open, setOpen] = useState(false)
    const { data: nft } = useGetNFTItemQuery(transaction.collection_id?._id && transaction.nft_id ? { collectionId: transaction.collection_id._id as string, nftId: transaction.nft_id as string } : skipToken)

    const date = new Date(transaction.createdAt);
    const formattedDate = date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="select-none w-[23vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                <DialogHeader className="bg-fixed w-full">
                    <DialogTitle >{transaction.type}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>Overview NFT Transaction</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <div className="flex flex-col w-full h-full overflow-x-auto space-y-[1vw] mb-[1vw]">
                    <div className="flex flex-col justify-center items-center space-y-2">
                        <Image src={nft?.img || '/image/default-nft.png'} priority={true} alt="NFT" width={20} height={20} className="w-[5vw] h-[5vw] rounded-2xl object-cover" />
                        <div className="text-md font-semibold">{nft?.name}</div>
                    </div>
                    <div className="flex flex-col space-y-4 text-sm divide-y-reverse-[5px]">
                        <div className="flex flex-row justify-between items-center">
                            <p>From</p>
                            <p>{`${transaction.from_wallet.slice(0, 6)}...${transaction.from_wallet.slice(38)}`}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>To</p>
                            <p>{`${transaction.to_wallet?.slice(0, 6)}...${transaction.to_wallet?.slice(38)}`}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Status</p>
                            <p>{transaction.status}</p>
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <p>Collection</p>
                            <div className="flex flex-col items-end">
                                <p className="font-semibold">{transaction.collection_id?.name}</p>
                                <p>{`${transaction.collection_id?.address.slice(0, 6)}...${transaction.collection_id?.address.slice(38)}`}</p>
                            </div>
                        </div>
                        {transaction.type !== 'Receive Physical NFT' ?
                            <div className="flex flex-row justify-between items-start">
                                <p>Price</p>
                                <div className="flex flex-col">
                                    <div className="flex flex-row space-x-1 justify-end">
                                        <p>{parseFloat(transaction.price || "")?.toFixed(6)}</p>
                                        <p className="font-semibold">{transaction.currency}</p>
                                    </div>
                                    <div className="flex flex-row space-x-1 justify-end">
                                        <p>{`$${parseFloat(transaction.priceUsd || "")?.toFixed(2)}`}</p>
                                        <p className="font-semibold">USD</p>
                                    </div>
                                </div>
                            </div> :
                            <>
                                <div className="flex flex-row justify-between items-start">
                                    <p>Phone</p>
                                    <p>{transaction.phone}</p>
                                </div>
                                <div className="flex flex-row justify-between items-start">
                                    <p>Name</p>
                                    <p>{transaction.name}</p>
                                </div>
                                <div className="flex flex-row justify-between items-start">
                                    <p>Address</p>
                                    <p className="break-words w-[60%] flex flex-row justify-end">{transaction.address}</p>
                                </div>
                                <div className="flex flex-row justify-between items-start">
                                    <p>Shipping status</p>
                                    <p className="break-words w-[60%] flex flex-row justify-end">{transaction.shipping_status}</p>
                                </div>
                                <div className="flex flex-row justify-between items-start">
                                    <p>Note</p>
                                    <p className="break-words w-[60%] flex flex-row justify-end">{transaction.note}</p>
                                </div>
                                <div className="flex flex-row justify-between items-start">
                                    <p>Pickup deadline</p>
                                    <p>{transaction.pickup_deadline}</p>
                                </div>
                                <div className="flex flex-row justify-between items-start">
                                    <p>Shipping fee</p>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row space-x-1 justify-end">
                                            <p>{`$${parseFloat(transaction.shipping_fee || "")?.toFixed(6)}`}</p>
                                            <p className="font-semibold">{transaction.currency}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between items-start">
                                    <p>Storage fee</p>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row space-x-1 justify-end">
                                            <p>{`$${parseFloat(transaction.storage_fee || "")?.toFixed(6)}`}</p>
                                            <p className="font-semibold">{transaction.currency}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                        <div className="flex flex-row justify-between items-start">
                            <p>Platform fee (0.3%)</p>
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`$${parseFloat(transaction.platform_fee || "")?.toFixed(6)}`}</p>
                                    <p className="font-semibold">{transaction.currency}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <p>Gas fee</p>
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`${parseFloat(transaction.gas_fee || "").toFixed(6)}`}</p>
                                    <p className="font-semibold">{transaction.currency}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Hash</p>
                            <p className="text-xs italic">{`${transaction.receipt_hash?.slice(0, 15)}...${transaction.receipt_hash?.slice(50)}`}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Time</p>
                            <p className="text-xs italic">{formattedDate}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}