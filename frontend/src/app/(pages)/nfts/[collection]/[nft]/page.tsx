'use client'
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useCallback, useEffect } from "react"
import { useAccount } from "wagmi"
import { ethers } from "ethers"
import { useCollection } from "@/hooks/useCollection"
import { useWeb3 } from "@/hooks/useWeb3"
import { useToast } from "@/hooks/useToast"
import { useGetNFTItemQuery, useGetNFTTransactionsByItemQuery, useGetReservesQuery, useAddNftTransactionMutation, useUpdateNftTransactionMutation, useGetTokenBalancesQuery } from "@/redux/features/api/apiSlice"
import { buyNFT } from "@/services/nftmarket/buyNFT"
import { sellNFT } from "@/services/nftmarket/sellNFT";
import { withdrawNFT } from "@/services/nftmarket/withdrawNFT";
import { transferNFT } from "@/services/nftmarket/transferNFT";
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { TagIcon } from "@heroicons/react/20/solid";
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
import Attributes from "@/components/nfts/Attributes"
import { skipToken } from "@reduxjs/toolkit/query"
import { Address, NFTActiveTransaction } from "@/lib/type"
import NFTTransactionWaiting from "@/components/transaction/NFTTransactionWaiting"
import { useGasBuyNFT, useGasSellNFT, useGasTransferNFT, useGasWithdrawNFT } from "@/hooks/useGas";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

export default function NFTPage() {
    const { isConnected, address } = useAccount()
    const { signer, provider } = useWeb3() || {}
    const { currentCollection } = useCollection()
    const { collection, nft } = useParams()
    const { showError } = useToast()
    const [listed, setListed] = useState<NFTActiveTransaction[] | []>([])
    const [prices, setPrices] = useState<NFTActiveTransaction[] | []>([])
    const { data: tokenBalances } = useGetTokenBalancesQuery(address ?? skipToken)
    const { data: actives } = useGetNFTTransactionsByItemQuery(currentCollection?._id && nft ? { collectionId: currentCollection?._id as string, nftId: nft as string } : skipToken)
    const { data: currentNft } = useGetNFTItemQuery(currentCollection?._id && nft ? { collectionId: currentCollection?._id as string, nftId: nft as string } : skipToken)
    const { data: reserves } = useGetReservesQuery()
    const [addNftTransaction] = useAddNftTransactionMutation()
    const [updateNftTransaction] = useUpdateNftTransactionMutation()
    const [to, setTo] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const UsdEth = reserves?.find(item => item.info.name === 'USD/ETH')
    const usdPriceCurrentNft = (parseFloat(currentNft?.formatted || '0') * parseFloat(UsdEth?.reserve1 || '0') / parseFloat(UsdEth?.reserve2 || '0')).toString()
    const [balance, setBalance] = useState<string>("")
    const gasBuy = useGasBuyNFT().toString()
    const gasTransfer = useGasTransferNFT().toString()
    const gasSell = useGasSellNFT().toString()
    const gasWithdraw = useGasWithdrawNFT().toString()

    useEffect(() => {
        if (tokenBalances) {
            setBalance(tokenBalances.find(item => item.info.symbol === 'ETH')?.balance?.formatted || "")
        }
    }, [tokenBalances])

    useEffect(() => {
        if (actives) {
            setListed(actives.filter(item => item.type === "Listed NFT"))
            const newPrices = actives.filter(item => item.type === "Buy NFT")
            setPrices(newPrices.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))
        }
    }, [actives])

    const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTo(e.target.value)
    }

    const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value)
    }

    const handleToastBalance = () => {
        showError("Your balance ETH is not enoungh!")
    }

    const handleToastAddress = () => {
        showError("Receiver address is invalid!")
    }

    const handleToastPrice = () => {
        showError("New price is invalid!")
    }

    const handleBuy = useCallback(async () => {
        if (!!provider && !!signer && !!address && !!currentCollection && !!currentNft) {
            const { data: newTransaction } = await addNftTransaction({
                type: 'Buy NFT',
                from_wallet: address,
                to_wallet: currentNft.owner,
                collection_id: currentCollection._id,
                nft_id: currentNft.nft_id.toString(),
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
                nft_id: currentNft.nft_id.toString(),
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
                nft_id: currentNft.nft_id.toString(),
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
                nft_id: currentNft.nft_id.toString(),
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

    const handleToastConnectWallet = () => {
        showError("Please Connect Wallet for Buy NFT")
    }

    return (<div className=" flex flex-col space-y-5">
        {nft &&
            <div className="flex flex-row space-x-5 select-none">
                <div className="flex flex-col w-[40%] space-y-3">
                    <Dialog>
                        <DialogTrigger className="flex flex-row justify-around items-center w-full h-full">
                            <ItemImage nft={currentNft} />
                        </DialogTrigger>
                        <DialogContent className="bg-transparent max-w-[50vw] max-h-[60vw] p-0 m-0 rounded-2xl border-none">
                            {currentNft?.animation ? (
                                <iframe
                                    src={currentNft.animation}
                                    className="bg-transparent w-[50vw] h-[60vw] border-none object-cover"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <Image src={currentNft?.img || '/image/default-nft.png'} priority={true} alt={currentNft?.name || "nft"} width={200} height={200} className="object-cover w-full h-full rounded-2xl" />
                            )}
                        </DialogContent>
                    </Dialog>
                    <ItemDescription nft={currentNft} />
                    <Attributes traits={currentNft?.traits || []} />
                </div>
                <div className="flex flex-col w-[60%] space-y-5">
                    <div className="flex flex-col space-y-3">
                        <div className="flex flex-row justify-start items-center space-x-3 text-blue-500">
                            <div className="text-lg font-semibold text-blue-600">{currentCollection?.name}</div>
                            {currentCollection?.verified && <CheckBadgeIcon className="w-5 h-5" />}
                            <div className='flex flex-row dark:bg-white/15 items-center space-x-2 border-[0.1px] border-red-100 dark:border-blue-500 rounded-xl text-xs py-1 px-2 shadow-md text-blue-500'>
                                <TagIcon className='w-[0.8vw] h-[0.8vw] ' />
                                <p>{currentCollection?.category}</p>
                            </div>
                        </div>
                        <div className="text-4xl font-bold">{currentNft?.name ? currentNft.name : `${currentCollection?.name} # ${currentNft?.nft_id}`}</div>
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
                                    ${usdPriceCurrentNft.slice(0, usdPriceCurrentNft.indexOf('.') + 2)}
                                </div>
                            </div>
                            <div className="flex flex-row space-x-2">
                                {currentNft?.owner !== address ? <>
                                    {currentNft?.isListed &&
                                        <>
                                            {isConnected ?
                                                <>
                                                    {
                                                        parseFloat(balance) > 0 ?
                                                            <NFTTransactionWaiting type="Buy NFT" handleSend={handleBuy} nft={currentNft} gasEth={gasBuy} address={address} collection={currentCollection}>
                                                                <Button className="bg-blue-500 hover:bg-blue-600 flex flex-row justify-center items-center w-[100%]">
                                                                    <ShoppingCartIcon className="w-6 h-6" />
                                                                    <div className="text-md font-semibold">Buy now</div>
                                                                </Button>
                                                            </NFTTransactionWaiting>
                                                            :
                                                            <Button onClick={handleToastBalance} className="bg-blue-500 hover:bg-blue-600 flex flex-row justify-center items-center w-[100%]">
                                                                <ShoppingCartIcon className="w-6 h-6" />
                                                                <div className="text-md font-semibold">Buy now</div>
                                                            </Button>
                                                    }
                                                </>
                                                :
                                                <Button onClick={handleToastConnectWallet} className="bg-blue-500 hover:bg-blue-600 flex flex-row justify-center items-center w-[100%]">
                                                    <ShoppingCartIcon className="w-6 h-6" />
                                                    <div className="text-md font-semibold">Buy now</div>
                                                </Button>
                                            }
                                        </>
                                    }
                                </> : <>
                                    {currentNft?.isListed ?
                                        <>
                                            {
                                                parseFloat(balance) > 0 ?
                                                    <NFTTransactionWaiting type="Withdraw NFT" handleSend={handleWithdraw} nft={currentNft} gasEth={gasWithdraw} address={address} collection={currentCollection}>
                                                        <Button className="bg-blue-500 hover:bg-blue-600 flex flex-row justify-center items-center w-[50%]">
                                                            <ArrowDownCircleIcon className="w-6 h-6" />
                                                            <div className="text-md font-semibold">Withdraw</div>
                                                        </Button>
                                                    </NFTTransactionWaiting>
                                                    :
                                                    <Button onClick={handleToastBalance} className="bg-blue-500 hover:bg-blue-600 flex flex-row justify-center items-center w-[50%]">
                                                        <ArrowDownCircleIcon className="w-6 h-6" />
                                                        <div className="text-md font-semibold">Withdraw</div>
                                                    </Button>
                                            }
                                        </>
                                        :
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button className="bg-blue-500 hover:bg-blue-600 flex flex-row justify-center items-center w-[50%]">
                                                    <TagIcon className="w-6 h-6" />
                                                    <div className="text-md font-semibold">Listed</div>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Provide new price for NFT?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Please input new price (ETH) in form below!
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <div>
                                                    <Input type="text" placeholder="Price ETH" value={amount} onChange={handleChangeAmount} />
                                                </div>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    {
                                                        parseFloat(balance) > 0 ?

                                                            <>
                                                                {
                                                                    parseFloat(amount) > 0 ?
                                                                        <NFTTransactionWaiting type="Sell NFT" handleSend={handleSell} nft={currentNft} gasEth={gasSell} address={address} collection={currentCollection} addressReceiver={to as Address} newPrice={amount}>
                                                                            <AlertDialogAction >Continue</AlertDialogAction>
                                                                        </NFTTransactionWaiting>
                                                                        :
                                                                        <AlertDialogAction onClick={handleToastPrice}>Continue</AlertDialogAction>
                                                                }
                                                            </>
                                                            :
                                                            <AlertDialogAction onClick={handleToastBalance}>Continue</AlertDialogAction>
                                                    }
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    }
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button className="bg-blue-500 hover:bg-blue-600 flex flex-row justify-center items-center w-[50%]">
                                                <ArrowsRightLeftIcon className="w-6 h-6" />
                                                <div className="text-md font-semibold">Transfer</div>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Provide receiver address for transfer NFT!</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Please input receiver in form below.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <div>
                                                <Input type="text" placeholder="Address receiver" value={to} onChange={handleChangeAddress} />
                                            </div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                {
                                                    parseFloat(balance) > 0 ?
                                                        <>
                                                            {ethers.isAddress(to)
                                                                ?
                                                                <NFTTransactionWaiting type="Transfer NFT" handleSend={handleTransfer} nft={currentNft} gasEth={gasTransfer} address={address} collection={currentCollection} addressReceiver={to as Address}>
                                                                    <AlertDialogAction >Continue</AlertDialogAction>
                                                                </NFTTransactionWaiting>
                                                                :
                                                                <AlertDialogAction onClick={handleToastAddress}>Continue</AlertDialogAction>
                                                            }
                                                        </>
                                                        :
                                                        <AlertDialogAction onClick={handleToastBalance}>Continue</AlertDialogAction>
                                                }
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