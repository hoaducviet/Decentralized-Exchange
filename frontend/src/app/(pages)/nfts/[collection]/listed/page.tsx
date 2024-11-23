'use client'
import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { useWeb3 } from "@/hooks/useWeb3";
import { useCollection } from "@/hooks/useCollection"
import { useAddNftTransactionMutation, useUpdateNftTransactionMutation, useGetCollectionQuery } from "@/redux/features/api/apiSlice";
import { buyNFT } from "@/services/nftmarket/buyNFT"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { NFT } from "@/lib/type";

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
    const { currentCollection } = useCollection()
    const [nft, setNft] = useState<NFT | undefined>(undefined)
    const web3 = useWeb3()
    const signer = web3?.signer
    const provider = web3?.provider
    const { address } = useAccount()
    const [addNftTransaction] = useAddNftTransactionMutation()
    const [updateNftTransaction] = useUpdateNftTransactionMutation()
    const { data, isFetching } = useGetCollectionQuery({ address, addressCollection: currentCollection?.address })
    const listed = data?.listed

    const handleSend = useCallback(async () => {
        if (!!provider && !!signer && !!address && !!nft && !!currentCollection) {
            const { data: newTransaction } = await addNftTransaction({
                type: 'Buy NFT',
                from_wallet: address,
                to_wallet: nft.owner,
                collection_id: currentCollection._id,
                nft_id: nft.id.toString(),
                price: nft.formatted,
            })
            try {
                const receipt = await buyNFT({ provider, signer, address, nft, collection: currentCollection })
                const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
                if (confirmedReceipt?.status === 1 && newTransaction?._id) {
                    updateNftTransaction({
                        _id: newTransaction._id,
                        receipt_hash: receipt.hash,
                    })
                    setNft(undefined)
                } else {
                    if (newTransaction?._id) {
                        updateNftTransaction({
                            _id: newTransaction._id,
                            receipt_hash: ""
                        })
                    }
                }
                console.log(receipt)
            } catch (error) {
                console.error("Transaction error:", error);
                if (newTransaction?._id) {
                    updateNftTransaction({
                        _id: newTransaction._id,
                        receipt_hash: ""
                    })
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, signer, address, nft, currentCollection])

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
                {!isFetching && listed && listed.map((nft, index) => {
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
                            <div className="flex justify-start w-[20%]">{nft.owner.slice(0, 6) + "..." + nft.owner.slice(38)}</div>
                            <div className="flex justify-start w-[20%]">
                                {nft.owner !== address &&
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button onClick={() => setNft(nft)} variant="secondary">Buy</Button>
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
                                                <AlertDialogAction onClick={handleSend}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}