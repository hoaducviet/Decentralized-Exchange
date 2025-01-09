'use client'
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useWeb3 } from "@/hooks/useWeb3";
import { useToast } from "@/hooks/useToast";
import { useCollection } from "@/hooks/useCollection"
import { useGetTokenBalancesQuery, useAddNftTransactionMutation, useUpdateNftTransactionMutation, useGetNFTByCollectionQuery } from "@/redux/features/api/apiSlice";
import { buyNFT } from "@/services/nftmarket/buyNFT"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { skipToken } from "@reduxjs/toolkit/query";
import { NFT } from "@/lib/type";
import NFTTransactionWaiting from "@/components/transaction/NFTTransactionWaiting";
import { useGasBuyNFT } from "@/hooks/useGas";

const options = [
    {
        name: 'Item'
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
    const { showError } = useToast()
    const { currentCollection } = useCollection()
    const [nft, setNft] = useState<NFT | undefined>(undefined)
    const web3 = useWeb3()
    const { collection } = useParams()
    const signer = web3?.signer
    const provider = web3?.provider
    const { address } = useAccount()
    const router = useRouter()
    const { data: tokenBalances } = useGetTokenBalancesQuery(address ?? skipToken)
    const [addNftTransaction] = useAddNftTransactionMutation()
    const [updateNftTransaction] = useUpdateNftTransactionMutation()
    const { data: nfts, isFetching } = useGetNFTByCollectionQuery(currentCollection?._id ?? skipToken)
    const [listed, setListed] = useState<NFT[] | undefined>(undefined)
    const [balance, setBalance] = useState<string>("")
    const gas = useGasBuyNFT().toString()

    useEffect(() => {
        if (tokenBalances) {
            setBalance(tokenBalances.find(item => item.info.symbol === 'ETH')?.balance?.formatted || "")
        }
    }, [tokenBalances])

    useEffect(() => {
        if (nfts) {
            setListed(nfts.filter(item => item.isListed))
        }
    }, [nfts])

    const handleToastBalance = () => {
        showError("Your balance ETH is not enoungh!")
    }

    const handleSend = useCallback(async () => {
        if (!!provider && !!signer && !!address && !!nft && !!currentCollection) {
            const { data: newTransaction } = await addNftTransaction({
                type: 'Buy NFT',
                from_wallet: address,
                to_wallet: nft.owner,
                collection_id: currentCollection._id,
                nft_id: nft.nft_id.toString(),
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
                            <div onClick={() => router.push(`/nfts/${collection}/${nft.nft_id}`)} className="flex flex-row justify-start items-center w-[80%]">
                                <div className="flex flex-row justify-start items-center w-[25%] h-full space-x-[0.5vw]">
                                    <Image src={nft.img || '/image/default-nft.png'} priority={true} alt={nft.name || "nft"} width={20} height={20} className="object-cover rounded-xl h-[4vw] w-[4vw]" />
                                    <div>{nft.name ? nft.name : `#${nft.nft_id}`}</div>
                                </div>
                                <div className="flex justify-start w-[25%]">Listed</div>
                                <div className="flex flex-row justify-start space-x-[0.4vw] w-[25%]">
                                    <p>{nft.formatted}</p>
                                    <p className="text-md font-semibold">ETH</p>
                                </div>
                                <div className="flex justify-start w-[25%]">{nft.owner.slice(0, 6) + "..." + nft.owner.slice(38)}</div>
                            </div>
                            <div className="flex justify-start w-[20%]">
                                {nft.owner !== address && parseFloat(balance) > parseFloat(nft?.formatted || "") ?
                                    <NFTTransactionWaiting type="Buy NFT" handleSend={handleSend} nft={nft} gasEth={gas} address={address} collection={currentCollection}>
                                        <Button onClick={() => setNft(nft)} variant="secondary">Buy</Button>
                                    </NFTTransactionWaiting>
                                    :
                                    <Button onClick={handleToastBalance} variant="secondary">Buy</Button>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}