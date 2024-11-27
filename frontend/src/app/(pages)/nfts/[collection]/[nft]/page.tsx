'use client'
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { useAccount } from "wagmi"
import { ethers } from "ethers"
import { useCollection } from "@/hooks/useCollection"
import { useWeb3 } from "@/hooks/useWeb3"
import { useGetCollectionQuery, useGetNFTTransactionsByItemQuery, useGetReservesQuery, useAddNftTransactionMutation, useUpdateNftTransactionMutation } from "@/redux/features/api/apiSlice"
import { buyNFT } from "@/services/nftmarket/buyNFT"
import { sellNFT } from "@/services/nftmarket/sellNFT";
import { withdrawNFT } from "@/services/nftmarket/withdrawNFT";
import { transferNFT } from "@/services/nftmarket/transferNFT";
import { TagIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { CheckBadgeIcon, ArrowsRightLeftIcon, ArrowDownCircleIcon } from '@heroicons/react/20/solid'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import ItemActivity from "@/components/nfts/ItemActivity"
import ItemListings from "@/components/nfts/ItemListings"
import ItemPriceHistory from "@/components/nfts/ItemPriceHistory"
import ItemDescription from "@/components/nfts/ItemDescription"
import ItemImage from "@/components/nfts/ItemImage"
import { NFT, Address } from "@/lib/type"

export default function NFTPage() {
    const { address } = useAccount()
    const { signer, provider } = useWeb3() || {}
    const { currentCollection } = useCollection()
    const [currentNft, setCurrentNft] = useState<NFT | undefined>(undefined)
    const { collection, nft } = useParams()
    const { data: nftItem } = useGetNFTTransactionsByItemQuery({ collectionId: currentCollection?._id as string, nftId: nft as string })
    const { data } = useGetCollectionQuery({ address, addressCollection: currentCollection?.address })
    const { data: reserves } = useGetReservesQuery()
    const [addNftTransaction] = useAddNftTransactionMutation()
    const [updateNftTransaction] = useUpdateNftTransactionMutation()
    const [to, setTo] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const { nfts } = data || {}
    const { listed, prices, actives } = nftItem || {};
    const UsdEth = reserves?.find(item => item.info.name === 'USD/ETH')
    const usdPriceCurrentNft = (parseFloat(currentNft?.formatted || '0') * parseFloat(UsdEth?.reserve1 || '0') / parseFloat(UsdEth?.reserve2 || '0')).toString()

    useEffect(() => {
        if (nfts) {
            setCurrentNft(nfts.find(item => item.id === Number(nft)))
        }
    }, [nfts, nft])

    const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTo(e.target.value)
    }

    const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value)
    }

    const handleBuy = useCallback(async () => {
        if (!!provider && !!signer && !!address && !!currentCollection && !!currentNft) {
            const { data: newTransaction } = await addNftTransaction({
                type: 'Buy NFT',
                from_wallet: address,
                to_wallet: currentNft.owner,
                collection_id: currentCollection._id,
                nft_id: currentNft.id.toString(),
                price: currentNft.formatted,
            })
            try {
                const receipt = await buyNFT({ provider, signer, address, nft: currentNft, collection: currentCollection })
                const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
                if (confirmedReceipt?.status === 1 && newTransaction?._id) {
                    updateNftTransaction({
                        _id: newTransaction._id,
                        receipt_hash: confirmedReceipt.hash,
                    })
                    setCurrentNft(undefined)
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
    }, [provider, signer, address, nft, currentCollection, currentNft])

    const handleWithdraw = useCallback(async () => {
        if (!!provider && !!signer && !!address && !!currentNft && !!currentCollection) {
            const { data: newTransaction } = await addNftTransaction({
                type: 'Withdraw NFT',
                from_wallet: address,
                to_wallet: currentCollection.address,
                collection_id: currentCollection._id,
                nft_id: currentNft.id.toString(),
                price: currentNft?.formatted,
            })
            try {
                const receipt = await withdrawNFT({ provider, signer, address, nft: currentNft, collection: currentCollection })
                const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
                if (confirmedReceipt?.status === 1 && newTransaction?._id) {
                    updateNftTransaction({
                        _id: newTransaction._id,
                        receipt_hash: receipt.hash,
                    })
                    setCurrentNft(undefined)
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
    }, [provider, signer, address, currentNft, currentCollection])

    const handleSell = useCallback(async () => {
        if (!!provider && !!signer && !!address && !!currentNft && !!currentCollection && parseFloat(amount) > 0) {
            const { data: newTransaction } = await addNftTransaction({
                type: 'Listed NFT',
                from_wallet: address,
                to_wallet: currentCollection.address,
                collection_id: currentCollection._id,
                nft_id: currentNft.id.toString(),
                price: amount,
            })

            try {
                const receipt = await sellNFT({ provider, signer, address, nft: currentNft, collection: currentCollection, amount })
                const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
                if (confirmedReceipt?.status === 1 && newTransaction?._id) {
                    updateNftTransaction({
                        _id: newTransaction._id,
                        receipt_hash: receipt.hash,
                    })
                    setCurrentNft(undefined)
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
    }, [provider, signer, address, currentNft, currentCollection, amount])

    const handleTransfer = useCallback(async () => {
        if (!!provider && !!signer && !!address && !!currentNft && !!currentCollection && ethers.isAddress(to)) {
            const { data: newTransaction } = await addNftTransaction({
                type: 'Transfer NFT',
                from_wallet: address,
                to_wallet: to as Address,
                collection_id: currentCollection._id,
                nft_id: currentNft.id.toString(),
                price: currentNft?.formatted,
            })
            try {
                const receipt = await transferNFT({ provider, signer, address, nft: currentNft, collection: currentCollection, to: to as Address })
                const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
                if (confirmedReceipt?.status === 1 && newTransaction?._id) {
                    updateNftTransaction({
                        _id: newTransaction._id,
                        receipt_hash: receipt.hash,
                    })
                    setCurrentNft(undefined)
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
    }, [provider, signer, address, nft, currentCollection, to])

    return (<div className=" flex flex-col space-y-5">
        {nft &&
            <div className="flex flex-row space-x-5 select-none">
                <div className="flex flex-col w-[40%] space-y-3">
                    <ItemImage nft={currentNft} />
                    <ItemDescription nft={currentNft} />
                </div>
                <div className="flex flex-col w-[60%] space-y-5">
                    <div className="flex flex-col space-y-3">
                        <div className="flex flex-row justify-start items-center space-x-3 text-blue-500">
                            <div className="text-lg font-semibold text-blue-600">{currentCollection?.name}</div>
                            {currentCollection?.verified && <CheckBadgeIcon className="w-5 h-5" />}
                        </div>
                        <div className="text-4xl font-bold">{currentNft?.name}</div>
                        <div className="flex felx-row text-md font-normal space-x-2">
                            <div>Owner by</div>
                            <div className="text-blue-600">{`${currentNft?.owner.slice(0, 7)}...${currentNft?.owner.slice(37, 42)}`}</div>
                        </div>
                    </div>
                    <Card className="rounded-2xl">
                        <CardContent className="flex flex-col py-4 space-y-2">
                            <div>Current price</div>
                            <div className="flex flex-row justify-start space-x-3 items-end leading-none">
                                <div className="flex flex-row items-end text-3xl font-semibold leading-none">
                                    {currentNft?.formatted} ETH
                                </div>
                                <div className="text-sm font-semibold opacity-75">
                                    $ {usdPriceCurrentNft.slice(0, usdPriceCurrentNft.indexOf('.') + 2)}
                                </div>
                            </div>
                            <div className="flex flex-row space-x-2">
                                {currentNft?.owner !== address ? <>
                                    {currentNft?.isListed &&
                                        <Button onClick={handleBuy} className="bg-blue-500 hover:bg-blue-600 flex flex-row justify-center items-center w-[100%]">
                                            <ShoppingCartIcon className="w-6 h-6" />
                                            <div className="text-md font-semibold">Buy now</div>
                                        </Button>
                                    }
                                </> : <>
                                    {currentNft?.isListed ?
                                        <Button onClick={handleWithdraw} className="bg-blue-500 hover:bg-blue-600 flex flex-row justify-center items-center w-[50%]">
                                            <ArrowDownCircleIcon className="w-6 h-6" />
                                            <div className="text-md font-semibold">Withdraw</div>
                                        </Button>
                                        :
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button onClick={handleSell} className="bg-blue-500 hover:bg-blue-600 flex flex-row justify-center items-center w-[50%]">
                                                    <TagIcon className="w-6 h-6" />
                                                    <div className="text-md font-semibold">Listed</div>
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
                                        </AlertDialog>

                                    }
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button onClick={handleTransfer} className="bg-blue-500 hover:bg-blue-600 flex flex-row justify-center items-center w-[50%]">
                                                <ArrowsRightLeftIcon className="w-6 h-6" />
                                                <div className="text-md font-semibold">Transfer</div>
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
                                </>
                                }
                            </div>
                        </CardContent>
                    </Card>
                    < ItemListings listed={listed ?? []} UsdEth={UsdEth} />
                    < ItemPriceHistory prices={prices ?? []} />
                </div>
            </div>
        }
        <div className="flex flex-col select-none">
            <ItemActivity actives={actives ?? []} />
        </div>
        <div className="select-none cursor-pointer flex flex-col justify-center items-center">
            <Button variant="secondary">
                <Link href={`/nfts/${collection}`}>
                    View Collection
                </Link>
            </Button>
        </div>
    </div>)
}