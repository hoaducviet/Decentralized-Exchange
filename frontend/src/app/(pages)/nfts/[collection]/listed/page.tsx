'use client'
import { useCollection } from "@/hooks/useCollection"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

const options = [
    {
        name: 'Item'
    },
    {
        name: 'Event'
    },
    {
        name: 'Price'
    },
    {
        name: 'By'
    },
    {
        name: ''
    },
]

export default function Listed() {
    const { nfts, listed } = useCollection()
    console.log({ nfts, listed })
    return (
        <div className="flex flex-col select-none h-full">
            <div className="flex flex-row justify-between items-center text-sm font-semibold opacity-60 h-[3vw] px-[1.5vw]">
                {options.map((option, index) => {
                    return (
                        <div key={index} className="flex justify-start w-[20%]">
                            {option.name}
                        </div>
                    )
                })}
            </div>
            <div className="flex flex-col">
                {listed.map((nft, index) => {
                    return (
                        <div key={index} className="cursor-pointer flex flex-row justify-between items-center border-gray-200 border-b-[0.1px] h-[6vw] px-[1.5vw]">
                            <div className="flex flex-row justify-start items-center w-[20%] h-full space-x-[0.5vw]">
                                <Image src={nft.img || '/image/default-nft.png'} alt={nft.name || "nft"} width={20} height={20} className="object-cover rounded-xl h-[4vw] w-[4vw]" />
                                <div>#{nft.id}</div>
                            </div>
                            <div className="flex justify-start w-[20%]">Listed</div>
                            <div className="flex flex-row justify-start space-x-[0.4vw] w-[20%]">
                                <p>{nft.formatted}</p>
                                <p className="text-md font-semibold">ETH</p>
                            </div>
                            <div className="flex justify-start w-[20%]">{nft.id}</div>
                            <div className="flex justify-start w-[20%]">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="secondary">Buy</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently withdraw your liquidity and send your tokens from liquidity pool.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}