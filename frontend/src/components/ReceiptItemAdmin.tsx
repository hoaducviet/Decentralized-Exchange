'use client'
import { NFTActiveTransaction } from '@/lib/type';
import { useGetNFTItemQuery } from "@/redux/features/api/apiSlice";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { skipToken } from "@reduxjs/toolkit/query";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import Image from "next/image";
interface Props {
    transaction: NFTActiveTransaction;
    index: number;
    handleOrderDone: (_id: string) => void;
}

export default function ReceiptItemAdmin({ transaction, index, handleOrderDone }: Props) {
    const { data: nft } = useGetNFTItemQuery(transaction?.collection_id?._id && transaction?.nft_id ? { collectionId: transaction.collection_id._id, nftId: transaction?.nft_id } : skipToken)
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
        <div className="flex flex-row cursor-pointer hover:bg-secondary/80 dark:hover:bg-white/5 text-md font-medium items-center h-[4vw] w-full px-4 border-t-[0.2px] border-gray-300 border-opacity-20" >
            <Dialog >
                <DialogTrigger asChild>
                    <div className="flex flex-row w-[80%]">
                        <p className="w-[6.25%] flex flex-row justify-start items-center">{index + 1}</p>
                        <div className="w-[31.25%] flex flex-row justify-start items-center space-x-4">
                            <Image src={nft?.img || '/image/nft-default.png'} alt={nft?.nft_id || 'NFT'} width={20} height={20} className="w-[3vw] h-[3vw] rounded-2xl" />
                            <p className="font-semibold">{nft?.name ? nft.name : `${transaction.collection_id.name} #${nft?.nft_id}`}</p>
                        </div>
                        <div className="w-[18.75%] flex flex-row justify-end items-center">{transaction.from_wallet.slice(0, 8)}</div>
                        <div className="w-[18.75%] flex flex-row justify-end items-center">{transaction.name}</div>
                        <div className="w-[25%] flex flex-row justify-end items-center space-x-2">{transaction.shipping_status}</div>
                    </div>
                </DialogTrigger>
                <DialogContent className="select-none w-[23vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                    <DialogHeader className="bg-fixed w-full">
                        <DialogTitle className="flex flex-row justify-center">{transaction.type}</DialogTitle>
                        <VisuallyHidden>
                            <DialogDescription>Information Order Limit Transaction</DialogDescription>
                        </VisuallyHidden>
                    </DialogHeader>
                    <div className="flex flex-col w-full h-full overflow-x-auto space-y-[1vw] mb-[1vw]">
                        <div className="flex flex-col justify-center items-center space-y-[1vw]">
                            <Image src={nft?.img || '/image/nft-default.png'} alt={nft?.nft_id || 'NFT'} width={20} height={20} className="w-[5vw] h-[5vw] rounded-2xl" />
                            <p className="font-semibold">{nft?.name ? nft.name : `${transaction.collection_id.name} #${nft?.nft_id}`}</p>
                        </div>
                        <div className="flex flex-col space-y-4 text-sm divide-y-reverse-[5px]">
                            <div className="flex flex-row justify-between items-center">
                                <p>From</p>
                                <p>{`${transaction.from_wallet.slice(0, 6)}...${transaction.from_wallet.slice(38)}`}</p>
                            </div>
                            <div className="flex flex-row justify-between items-center">
                                <p>Collection</p>
                                <p>{transaction.collection_id.name}</p>
                            </div>
                            <div className="flex flex-row justify-between items-center">
                                <p>Status</p>
                                <p>{transaction.status}</p>
                            </div>
                            <div className="flex flex-row justify-between items-center">
                                <p>Shipping status</p>
                                <p>{transaction.shipping_status}</p>
                            </div>
                            <div className="flex flex-row justify-between items-center">
                                <p>Phone</p>
                                <p>{transaction.phone}</p>
                            </div>
                            <div className="flex flex-row justify-between items-center">
                                <p>Name</p>
                                <p>{transaction.name}</p>
                            </div>
                            <div className="flex flex-row justify-between items-start space-x-[3vw]">
                                <p>Address</p>
                                <p className="flex flex-row justify-end break-words">{transaction.address}</p>
                            </div>
                            <div className="flex flex-row justify-between items-start space-x-[3vw]">
                                <p>Note</p>
                                <p className="flex flex-row justify-end break-words">{transaction.note}</p>
                            </div>
                            <div className="flex flex-row justify-between items-center space-x-[1vw] w-full">
                                <p>Price</p>
                                <div className="flex flex-row space-x-2">
                                    <p>{nft?.formatted}</p>
                                    <p className="font-semibold">{transaction.currency}</p>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between items-center space-x-[1vw] w-full">
                                <p>Gas fee</p>
                                <div className="flex flex-row space-x-2">
                                    <p>{parseFloat(transaction?.gas_fee || "").toFixed(6)}</p>
                                    <p className="font-semibold">{transaction.currency}</p>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between items-center space-x-[1vw] w-full">
                                <p>Storage fee</p>
                                <div className="flex flex-row space-x-2">
                                    <p>{parseFloat(transaction?.storage_fee || "").toFixed(6)}</p>
                                    <p className="font-semibold">{transaction.currency}</p>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between items-center space-x-[1vw] w-full">
                                <p>Shipping fee</p>
                                <div className="flex flex-row space-x-2">
                                    <p>{parseFloat(transaction?.shipping_fee || "").toFixed(6)}</p>
                                    <p className="font-semibold">{transaction.currency}</p>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between items-center space-x-[1vw] w-full">
                                <p>Platform fee</p>
                                <div className="flex flex-row space-x-2">
                                    <p>{parseFloat(transaction?.platform_fee || "").toFixed(6)}</p>
                                    <p className="font-semibold">{transaction.currency}</p>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between items-center">
                                <p>Hash</p>
                                <p className="text-xs italic">{`${transaction.receipt_hash?.slice(0, 15)}...${transaction.receipt_hash?.slice(50)}`}</p>
                            </div>
                            <div className="flex flex-row justify-between items-center">
                                <p>Pickup Deadline</p>
                                <p>{transaction.pickup_deadline}</p>
                            </div>
                            <div className="flex flex-row justify-between items-center">
                                <p>Time</p>
                                <p className="text-xs italic">{formattedDate}</p>
                            </div>

                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="w-[20%] flex flex-row justify-end items-center">
                {transaction.shipping_status === 'Pending' &&
                    <div className="w-[15%] flex flex-row justify-end items-center">
                        <AlertDialog >
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">Order Done</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                <AlertDialogHeader className="bg-fixed w-full">
                                    <AlertDialogTitle className="flex flex-row justify-center">Done Shipping</AlertDialogTitle>
                                    <VisuallyHidden>
                                        <AlertDialogDescription>Form Done Shipping Admin</AlertDialogDescription>
                                    </VisuallyHidden>
                                </AlertDialogHeader>
                                <div className="flex flex-col w-full space-y-[1vw]">
                                    <div className="flex flex-col justify-center items-center w-full space-y-[1vw]">
                                        <Image src={nft?.img || '/image/nft-default.png'} alt={nft?.nft_id || 'NFT'} width={20} height={20} className="w-[5vw] h-[5vw] rounded-2xl" />
                                        <p className="font-semibold">{nft?.name ? nft.name : `${transaction.collection_id.name} #${nft?.nft_id}`}</p>
                                    </div>
                                    <div className="flex flex-row justify-between items-center space-x-[1vw] w-full">
                                        <p className="font-semibold">Owner</p>
                                        <p>{`${transaction.from_wallet.slice(0, 8)}...${transaction.from_wallet.slice(38)}`}</p>
                                    </div>
                                    <div className="flex flex-row justify-between items-center space-x-[1vw] w-full">
                                        <p className="font-semibold">Price</p>
                                        <div className="flex flex-row space-x-2">
                                            <p>{nft?.formatted}</p>
                                            <p className="font-semibold">{transaction.currency}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between items-center space-x-[1vw] w-full">
                                        <p className="font-semibold">Collection</p>
                                        <p>{transaction.collection_id.name}</p>
                                    </div>
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel >Close</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleOrderDone(transaction._id)}>Done</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                }
            </div>
        </div>
    )
} 