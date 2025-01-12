'use client'
import { useGetCollectionsQuery } from "@/redux/features/api/apiSlice"
import useAuthCheck from "@/hooks/useAuthCheck"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useConfirmSendPhysicalNFTMutation, useGetNFTPhysicalNotHasQuery, useGetNFTPhysicalReceiveTransactionQuery, useConfirmOrderDoneMutation } from "@/redux/features/admin/adminSlice"
import { useEffect } from "react"
import { useToast } from "@/hooks/useToast"
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components//ui/tabs'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import Image from "next/image"
import ReceiptItemAdmin from "@/components/ReceiptItemAdmin"

const options = ['#', 'NFT', 'Category', 'Price', 'Owner']
const options2 = ['#', 'NFT', 'Owner', 'Name', 'Shipping']
const list = ['Request Listed NFT Physical', 'Receipt Get NFT Physical']
export default function TokenAdmin() {
    useAuthCheck()
    const { showSuccess, showError } = useToast()
    const { data: nfts } = useGetNFTPhysicalNotHasQuery()
    const { data: collections } = useGetCollectionsQuery()
    const { data: transactions } = useGetNFTPhysicalReceiveTransactionQuery()
    const [confirmSendPhysicalNFT, { isSuccess: isSuccessConfirm, isError: isErrorConfirm }] = useConfirmSendPhysicalNFTMutation()
    const [confirmOrderDone, { isSuccess: isSuccessConfirmOrderDone, isError: isErrorConfirmOrderDone }] = useConfirmOrderDoneMutation()

    useEffect(() => {
        if (isSuccessConfirm) {
            showSuccess("Confirm NFT Physical Send Is Success!")
        }
        if (isErrorConfirm) {
            showError("Confirm NFT Physical Send Is Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessConfirm, isErrorConfirm])

    useEffect(() => {
        if (isSuccessConfirmOrderDone) {
            showSuccess("Confirm NFT Physical Order Is Success!")
        }
        if (isErrorConfirmOrderDone) {
            showError("Confirm NFT Physical Order Is Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessConfirmOrderDone, isErrorConfirmOrderDone])

    const handleComfirmSendPhysicalNFT = async (_id: string) => {
        await confirmSendPhysicalNFT({ _id })
    }

    const handleOrderDone = async (_id: string) => {
        await confirmOrderDone({ _id })
    }

    return (
        <div className="select-none flex flex-col justify-center items-center w-full  py-[2vw] space-y-[2vw]">
            <div className="flex flex-row w-full justify-center items-center space-x-[4vw] text-white">
                <div className="cursor-pointer dark:bg-white/10 bg-blue-500 dark:border-white/40 hover:dark:border-blue-500 border-[0.1px] flex flex-row justify-center items-center rounded-2xl shadow-2xl space-x-2 h-[3vw] w-[17vw]">
                    <p className="font-semibold ">{`${nfts?.length} ${list[0]}`}</p>
                </div>
                <div className="cursor-pointer dark:bg-white/10 bg-blue-500 dark:border-white/40 hover:dark:border-blue-500 border-[0.1px] flex flex-row justify-center items-center rounded-2xl shadow-2xl space-x-2 h-[3vw] w-[17vw]">
                    <p className="font-semibold ">{`${transactions?.length} ${list[1]}`}</p>
                </div>
            </div>
            <div className="w-full px-[4vw]">
                <Tabs defaultValue="active" className="flex flex-col justify-center">
                    <TabsList className="flex flex-rol select-none justify-center items-center mx-[20%]">
                        <TabsTrigger value="active" className="w-[50%] h-full">NFT Physical Listed</TabsTrigger>
                        <TabsTrigger value="suspended" className="w-[50%] h-full">Receipt Shipping NFT</TabsTrigger>
                    </TabsList>
                    <TabsContent value="active" className="w-full">
                        <Card className=" flex flex-col w-full rounded-2xl border-[1px] shadow-md ">
                            <div className="bg-secondary/80 hover:bg-secondary flex flex-row justify-between items-center text-md font-semibold rounded-t-2xl h-[3vw] px-4">
                                <div className="w-[5%] flex flex-row justify-start items-center">{options[0]}</div>
                                <div className="w-[25%] flex flex-row justify-start items-center">{options[1]}</div>
                                <div className="w-[15%] flex flex-row justify-end items-center">{options[2]}</div>
                                <div className="w-[15%] flex flex-row justify-end items-center">{options[3]}</div>
                                <div className="w-[20%] flex flex-row justify-end items-center">{options[4]}</div>
                                <div className="w-[20%] flex flex-row justify-end items-center"></div>
                            </div>
                            <div className="flex flex-col max-h-[55vw] overflow-x-auto ">
                                {nfts && nfts.map((nft, index) => {
                                    const collection = collections?.find(item => item._id === nft.collection_id)
                                    return (
                                        <div key={index}>
                                            <div className={`flex flex-row cursor-pointer hover:bg-secondary/80 dark:hover:bg-white/5 text-md font-medium items-center h-[4vw] w-full px-4 border-t-[0.2px] border-gray-300 border-opacity-20 ${index === nfts.length - 1 ? 'rounded-b-2xl' : ''}`} >
                                                <p className="w-[5%] flex flex-row justify-start items-center">{index + 1}</p>
                                                <div className="w-[25%] flex flex-row justify-start items-center space-x-3">
                                                    <Image src={nft.img || '/image/nft-default.png'} priority={true} width={20} height={20} alt={nft.name} className="w-[3vw] h-[3vw] rounded-2xl" />
                                                    <p className="font-semibold">{nft.name ? nft.name : `${collection?.name} #${nft.nft_id}`}</p>
                                                </div>
                                                <div className="w-[15%] flex flex-row justify-end items-center">{nft.category}</div>
                                                <div className="w-[15%] flex flex-row justify-end items-center space-x-2">
                                                    <p>{nft.formatted}</p>
                                                    <p className="font-semibold">ETH</p>
                                                </div>
                                                <div className="w-[20%] flex flex-row justify-end items-center">{nft.owner.slice(0, 8)}</div>
                                                <div className="w-[20%] flex flex-row justify-end items-center">
                                                    <AlertDialog >
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline">Send Physical</Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                                            <AlertDialogHeader className="bg-fixed w-full">
                                                                <AlertDialogTitle className="flex flex-row justify-center">Confirm Send Physical NFT</AlertDialogTitle>
                                                                <VisuallyHidden>
                                                                    <AlertDialogDescription>Form Send Physical NFT Admin</AlertDialogDescription>
                                                                </VisuallyHidden>
                                                            </AlertDialogHeader>
                                                            <div className="flex flex-col w-full space-y-[1vw]">
                                                                <div className="flex flex-col justify-center items-center w-full space-y-[1vw]">
                                                                    <Image src={nft.img || '/image/nft-default.png'} priority={true} width={20} height={20} alt={nft.name} className="w-[4vw] h-[4vw] rounded-2xl" />
                                                                    <p className="font-semibold">{nft.name ? nft.name : `${collection?.name} #${nft.nft_id}`}</p>
                                                                </div>
                                                                <div className="flex flex-row justify-between items-center space-x-[1vw] w-full">
                                                                    <p className="font-semibold">Owner</p>
                                                                    <p>{`${nft.owner.slice(0, 8)}...${nft.owner.slice(38)}`}</p>
                                                                </div>
                                                                <div className="flex flex-row justify-between items-center w-full">
                                                                    <p className="font-semibold">Price</p>
                                                                    <div className="flex flex-row justify-end items-center space-x-[0.5vw]">
                                                                        <p>{nft.formatted}</p>
                                                                        <p className="font-semibold">ETH</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-row justify-between items-center w-full">
                                                                    <p className="font-semibold">Category</p>
                                                                    <p>{nft.category}</p>
                                                                </div>
                                                            </div>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel >Close</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleComfirmSendPhysicalNFT(nft._id)} >Confirm</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Card>
                    </TabsContent>
                    <TabsContent value="suspended" className="w-full">
                        <Card className=" flex flex-col w-full rounded-2xl border-[1px] shadow-md ">
                            <div className="bg-secondary/80 hover:bg-secondary flex flex-row justify-between items-center text-md font-semibold rounded-t-2xl h-[3vw] px-4">
                                <div className="w-[5%] flex flex-row justify-start items-center">{options2[0]}</div>
                                <div className="w-[25%] flex flex-row justify-start items-center">{options2[1]}</div>
                                <div className="w-[15%] flex flex-row justify-end items-center">{options2[2]}</div>
                                <div className="w-[15%] flex flex-row justify-end items-center">{options2[3]}</div>
                                <div className="w-[20%] flex flex-row justify-end items-center">{options2[4]}</div>
                                <div className="w-[20%] flex flex-row justify-end items-center"></div>
                            </div>
                            <div className="flex flex-col max-h-[55vw] overflow-x-auto ">
                                {transactions && transactions.map((transaction, index) => {
                                    return (
                                        <div key={index}>
                                            <ReceiptItemAdmin transaction={transaction} index={index} handleOrderDone={handleOrderDone} />
                                        </div>
                                    )
                                })}
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}