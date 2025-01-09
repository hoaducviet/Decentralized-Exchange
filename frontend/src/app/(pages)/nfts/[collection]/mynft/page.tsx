'use client'
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ethers } from 'ethers';
import { useWeb3 } from "@/hooks/useWeb3";
import { useToast } from "@/hooks/useToast";
import { useAddNftTransactionMutation, useUpdateNftTransactionMutation, useGetNFTByCollectionQuery, useGetTokenBalancesQuery } from "@/redux/features/api/apiSlice";
import { useCollection } from "@/hooks/useCollection"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { sellNFT } from "@/services/nftmarket/sellNFT";
import { withdrawNFT } from "@/services/nftmarket/withdrawNFT";
import { transferNFT } from "@/services/nftmarket/transferNFT";
import { skipToken } from "@reduxjs/toolkit/query";
import { NFT, Address } from "@/lib/type";
import NFTTransactionWaiting from "@/components/transaction/NFTTransactionWaiting";
import { useGasSellNFT, useGasTransferNFT, useGasWithdrawNFT } from "@/hooks/useGas";

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
    const { showError } = useToast()
    const { currentCollection } = useCollection()
    const [nft, setNft] = useState<NFT | undefined>(undefined)
    const web3 = useWeb3()
    const signer = web3?.signer
    const provider = web3?.provider
    const { address } = useAccount()
    const { collection } = useParams()
    const router = useRouter()
    const [amount, setAmount] = useState<string>("")
    const [to, setTo] = useState<string>("")
    const { data: tokenBalances } = useGetTokenBalancesQuery(address ?? skipToken)
    const [addNftTransaction] = useAddNftTransactionMutation()
    const [updateNftTransaction] = useUpdateNftTransactionMutation()
    const { data: nfts, isFetching } = useGetNFTByCollectionQuery(currentCollection?._id ?? skipToken)
    const [mylist, setMylist] = useState<NFT[] | undefined>(undefined)
    const [balance, setBalance] = useState<string>("")
    const gasWithdraw = useGasWithdrawNFT().toString()
    const gasTransfer = useGasTransferNFT().toString()
    const gasSell = useGasSellNFT().toString()

    useEffect(() => {
        if (tokenBalances) {
            setBalance(tokenBalances.find(item => item.info.symbol === 'ETH')?.balance?.formatted || "")
        }
    }, [tokenBalances])

    useEffect(() => {
        if (nfts) {
            setMylist(nfts.filter(item => item.owner === address))
        }
    }, [nfts, address])

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

    const handleWithdraw = useCallback(async () => {
        if (!!provider && !!signer && !!address && !!nft && !!currentCollection) {
            const { data: newTransaction } = await addNftTransaction({
                type: 'Withdraw NFT',
                from_wallet: address,
                to_wallet: currentCollection.address,
                collection_id: currentCollection._id,
                nft_id: nft.nft_id.toString(),
                price: nft.formatted,
            })
            try {
                const receipt = await withdrawNFT({ provider, signer, address, nft, collection: currentCollection })
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

    const handleSell = useCallback(async () => {
        if (!!provider && !!signer && !!address && !!nft && !!currentCollection && parseFloat(amount) > 0) {
            const { data: newTransaction } = await addNftTransaction({
                type: 'Listed NFT',
                from_wallet: address,
                to_wallet: currentCollection.address,
                collection_id: currentCollection._id,
                nft_id: nft.nft_id.toString(),
                price: amount,
            })

            try {
                const receipt = await sellNFT({ provider, signer, address, nft, collection: currentCollection, amount })
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
    }, [provider, signer, address, nft, currentCollection, amount])

    const handleTransfer = useCallback(async () => {
        if (!!provider && !!signer && !!address && !!nft && !!currentCollection && ethers.isAddress(to)) {
            const { data: newTransaction } = await addNftTransaction({
                type: 'Transfer NFT',
                from_wallet: address,
                to_wallet: to as Address,
                collection_id: currentCollection._id,
                nft_id: nft.nft_id.toString(),
                price: nft.formatted,
            })
            try {
                const receipt = await transferNFT({ provider, signer, address, nft, collection: currentCollection, to: to as Address })
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
                            <div onClick={() => router.push(`/nfts/${collection}/${nft.nft_id}`)} className="flex flex-row justify-start items-center w-[75%]">
                                <div className="flex flex-row justify-start items-center w-1/3 h-full space-x-[0.5vw]">
                                    <Image src={nft.img || '/image/default-nft.png'} priority={true} alt={nft.name || "nft"} width={20} height={20} className="object-cover rounded-xl h-[4vw] w-[4vw]" />
                                    <div>{nft.name ? nft.name : `#${nft.nft_id}`}</div>
                                </div>
                                <div className="flex justify-start w-1/3">{nft.isListed ? "Listed" : "Not Listed"}</div>
                                <div className="flex flex-row justify-start space-x-[0.4vw] w-1/3">
                                    <p>{nft.formatted}</p>
                                    <p className="text-md font-semibold">ETH</p>
                                </div>
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
                                                            <NFTTransactionWaiting type="Transfer NFT" handleSend={handleTransfer} nft={nft} gasEth={gasTransfer} address={address} collection={currentCollection} addressReceiver={to as Address}>
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
                                {nft.isListed &&
                                    <>
                                        {parseFloat(balance) > 0 ?
                                            <NFTTransactionWaiting type="Withdraw NFT" handleSend={handleWithdraw} nft={nft} gasEth={gasWithdraw} address={address} collection={currentCollection}>
                                                <Button onClick={() => setNft(nft)} variant="secondary">
                                                    Withdraw
                                                </Button>
                                            </NFTTransactionWaiting>
                                            :
                                            <Button onClick={handleToastBalance} variant="secondary">
                                                Withdraw
                                            </Button>}
                                    </>
                                }
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button onClick={() => setNft(nft)} variant="secondary">
                                            Sell
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
                                                                <NFTTransactionWaiting type="Sell NFT" handleSend={handleSell} nft={nft} gasEth={gasSell} address={address} collection={currentCollection} addressReceiver={to as Address} newPrice={amount}>
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
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}