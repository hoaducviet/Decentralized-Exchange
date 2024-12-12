'use client'
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useParams } from "next/navigation";
import { useCollection } from "@/hooks/useCollection"
import { useWeb3 } from "@/hooks/useWeb3";
import { useAddNftTransactionMutation, useUpdateNftTransactionMutation, useGetNFTByCollectionQuery, useGetTokenBalancesQuery } from "@/redux/features/api/apiSlice";
import { buyNFT } from "@/services/nftmarket/buyNFT"
import NFTCards from "@/components/nfts/NFTCards"
import { NFT } from "@/lib/type";
import { skipToken } from "@reduxjs/toolkit/query";

export default function CollectionNFT() {
    const { currentCollection } = useCollection()
    const { collection } = useParams()
    const [nft, setNft] = useState<NFT | undefined>(undefined)
    const web3 = useWeb3()
    const signer = web3?.signer
    const provider = web3?.provider
    const { isConnected, address } = useAccount()
    const [addNftTransaction] = useAddNftTransactionMutation()
    const [updateNftTransaction] = useUpdateNftTransactionMutation()
    const { data: nfts, isFetching } = useGetNFTByCollectionQuery(currentCollection?._id ?? skipToken)
    const { data: tokenBalances } = useGetTokenBalancesQuery(address ?? skipToken)
    const [balance, setBalance] = useState<string>("")

    useEffect(() => {
        if (tokenBalances) {
            setBalance(tokenBalances.find(item => item.info.symbol === 'ETH')?.balance?.formatted || "")
        }
    }, [tokenBalances])

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
                        receipt_hash: confirmedReceipt.hash,
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
        <div className="flex flex-co h-full">
            {!isFetching && nfts && <NFTCards nfts={nfts} setNft={setNft} handleSend={handleSend} address={address} isConnected={isConnected} collectionName={collection as string} collection={currentCollection} balance={balance}/>}
        </div>
    )
}