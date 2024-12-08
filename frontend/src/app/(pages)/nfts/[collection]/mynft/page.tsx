'use client'
import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "ethers"
import { ethers } from 'ethers';
import { useWeb3 } from "@/hooks/useWeb3";
import { useAddNftTransactionMutation, useUpdateNftTransactionMutation, useGetCollectionQuery } from "@/redux/features/api/apiSlice";
import { useCollection } from "@/hooks/useCollection"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { sellNFT } from "@/services/nftmarket/sellNFT";
import { withdrawNFT } from "@/services/nftmarket/withdrawNFT";
import { transferNFT } from "@/services/nftmarket/transferNFT";
import { NFT, Address } from "@/lib/type";

const options = [
    {
        name: 'Item'
    },
    {
        name: 'Status'
    },
    {
        name: 'Price'
    },
    {
        name: ''
    },
]

export default function MyNFT() {
    const { currentCollection } = useCollection()
    const [nft, setNft] = useState<NFT | undefined>(undefined)
    const web3 = useWeb3()
    const signer = web3?.signer
    const provider = web3?.provider
    const { address } = useAccount()
    const [amount, setAmount] = useState<string>("")
    const [to, setTo] = useState<string>("")
    const [addNftTransaction] = useAddNftTransactionMutation()
    const [updateNftTransaction] = useUpdateNftTransactionMutation()
    const { data, isFetching } = useGetCollectionQuery({ address, addressCollection: currentCollection?.address })
    const mylist = data?.mylist
    const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTo(e.target.value)
    }

    const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value)
    }

    const handleWithdraw = useCallback(async () => {
        if (!!provider && !!signer && !!address && !!nft && !!currentCollection) {
            const { data: newTransaction } = await addNftTransaction({
                type: 'Withdraw NFT',
                from_wallet: address,
                collection_id: currentCollection._id,
                nft_id: nft.id.toString(),
                price: nft.formatted,
            })
            try {
                const receipt = await withdrawNFT({ provider, signer, address, nft, collection: currentCollection })
                const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
                if (confirmedReceipt?.status === 1 && newTransaction?._id) {
                    updateNftTransaction({
                        id: newTransaction._id,
                        data: {
                            gas_fee: formatEther(confirmedReceipt.gasPrice * confirmedReceipt.gasUsed),
                            receipt_hash: confirmedReceipt.hash,
                            status: 'Completed'
                        }
                    })
                    setNft(undefined)
                } else {
                    if (newTransaction?._id) {
                        updateNftTransaction({
                            id: newTransaction._id,
                            data: {
                                status: 'Failed'
                            }
                        })
                    }
                }
                console.log(receipt)
            } catch (error) {
                console.error("Transaction error:", error);
                if (newTransaction?._id) {
                    updateNftTransaction({
                        id: newTransaction._id,
                        data: {
                            status: 'Failed'
                        }
                    })
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, signer, address, nft, currentCollection])

    const handleSell = useCallback(async () => {
        if (!!provider && !!signer && !!address && !!nft && !!currentCollection && parseFloat(amount) > 0) {
            const { data: newTransaction } = await addNftTransaction({
                type: 'Listed NFT',
                from_wallet: address,
                collection_id: currentCollection._id,
                nft_id: nft.id.toString(),
                price: amount,
            })

            try {
                const receipt = await sellNFT({ provider, signer, address, nft, collection: currentCollection, amount })
                const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
                if (confirmedReceipt?.status === 1 && newTransaction?._id) {
                    updateNftTransaction({
                        id: newTransaction._id,
                        data: {
                            gas_fee: formatEther(confirmedReceipt.gasPrice * confirmedReceipt.gasUsed),
                            receipt_hash: confirmedReceipt.hash,
                            status: 'Completed'
                        }
                    })
                    setNft(undefined)
                } else {
                    if (newTransaction?._id) {
                        updateNftTransaction({
                            id: newTransaction._id,
                            data: {
                                status: 'Failed'
                            }
                        })
                    }
                }
                console.log(receipt)
            } catch (error) {
                console.error("Transaction error:", error);
                if (newTransaction?._id) {
                    updateNftTransaction({
                        id: newTransaction._id,
                        data: {
                            status: 'Failed'
                        }
                    })
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, signer, address, nft, currentCollection, amount])

    const handleTransfer = useCallback(async () => {
        if (!ethers.isAddress(to)) {
            console.log("Address incorrect")
            return
        }
        if (!!provider && !!signer && !!address && !!nft && !!currentCollection && !!to) {
            const { data: newTransaction } = await addNftTransaction({
                type: 'Transfer NFT',
                from_wallet: address,
                to_wallet: to as Address,
                collection_id: currentCollection._id,
                nft_id: nft.id.toString(),
                price: nft.formatted,
            })
            try {
                const receipt = await transferNFT({ provider, signer, address, nft, collection: currentCollection, to: to as Address })
                const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
                if (confirmedReceipt?.status === 1 && newTransaction?._id) {
                    updateNftTransaction({
                        id: newTransaction._id,
                        data: {
                            gas_fee: formatEther(confirmedReceipt.gasPrice * confirmedReceipt.gasUsed),
                            receipt_hash: confirmedReceipt.hash,
                            status: 'Completed'
                        }
                    })
                    setNft(undefined)
                } else {
                    if (newTransaction?._id) {
                        updateNftTransaction({
                            id: newTransaction._id,
                            data: {
                                status: 'Failed'
                            }
                        })
                    }
                }
                console.log(receipt)
            } catch (error) {
                console.error("Transaction error:", error);
                if (newTransaction?._id) {
                    updateNftTransaction({
                        id: newTransaction._id,
                        data: {
                            status: 'Failed'
                        }
                    })
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, signer, address, nft, currentCollection, to])


    return (
        <div className="flex flex-col select-none h-full">
            <div className="flex flex-row justify-between items-center text-sm font-semibold opacity-60 h-[3vw] px-[1.5vw]">
                {options.map((option, index) => {
                    return (
                        <div key={index} className="flex justify-start w-[25%]">
                            {option.name}
                        </div>
                    )
                })}
            </div>
            <div className="flex flex-col">
                {!isFetching && mylist && mylist.map((nft, index) => {
                    return (
                        <div key={index} className="cursor-pointer flex flex-row justify-between items-center border-gray-200 border-b-[0.1px] h-[6vw] px-[1.5vw]">
                            <div className="flex flex-row justify-start items-center w-[25%] h-full space-x-[0.5vw]">
                                <Image src={nft.img || '/image/default-nft.png'} alt={nft.name || "nft"} width={20} height={20} className="object-cover rounded-xl h-[4vw] w-[4vw]" />
                                <div>#{nft.id}</div>
                            </div>
                            <div className="flex justify-start w-[25%]">{nft.isListed ? "Listed" : "Not Listed"}</div>
                            <div className="flex flex-row justify-start space-x-[0.4vw] w-[25%]">
                                <p>{nft.formatted}</p>
                                <p className="text-md font-semibold">ETH</p>
                            </div>
                            <div className="flex flex-row justify-start space-x-[1vw] w-[25%]">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button onClick={() => setNft(nft)} variant="secondary">
                                            Transfer
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently withdraw your liquidity and send your tokens from liquidity pool.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <div>
                                            <Input type="text" placeholder="address" value={to} onChange={handleChangeAddress} />
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleTransfer}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                {nft.isListed ?
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button onClick={() => setNft(nft)} variant="secondary">
                                                Withdraw
                                            </Button>
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
                                                <AlertDialogAction onClick={handleWithdraw}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    :
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button onClick={() => setNft(nft)} variant="secondary">
                                                Sell
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently withdraw your liquidity and send your tokens from liquidity pool.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <div>
                                                <Input type="text" placeholder="price" value={amount} onChange={handleChangeAmount} />
                                            </div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleSell}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}