'use client'
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAccount } from "wagmi";
import { useCollections } from "@/hooks/useCollections"
import { useCollection } from "@/hooks/useCollection"
import { useWeb3 } from "@/hooks/useWeb3";
import { resetNFTs } from "@/redux/features/collection/collectionSlice";
import { setCurrentCollection } from "@/redux/features/collection/collectionSlice";
import { buyNFT } from "@/services/nftmarket/buyNFT"
import NFTCards from "@/components/nfts/NFTCards"
import { NFT } from "@/lib/type";
interface Params {
    collection: string;
}

export default function CollectionNFT({ params }: { params: Params }) {
    const { collections } = useCollections()
    const { collection } = params
    const dispatch = useDispatch()
    const { nfts, currentCollection } = useCollection()
    const [nft, setNft] = useState<NFT | undefined>(undefined)
    const web3 = useWeb3()
    const signer = web3?.signer
    const provider = web3?.provider
    const { address } = useAccount()


    useEffect(() => {
        if (!!collection) {
            const current = collections.find(item => item.name.toLowerCase().replace(/\s+/g, '') === collection)
            if (!!current) {
                dispatch(setCurrentCollection(current))
            }
        }
    }, [collection, collections, dispatch])

    const handleSend = useCallback(async () => {
        if (!!provider && !!signer && !!address && !!nft && !!currentCollection) {
            try {
                const receipt = await buyNFT({ provider, signer, address, nft, collection: currentCollection })
                const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
                if (confirmedReceipt?.status === 1) {
                    dispatch(resetNFTs())
                    setNft(undefined)
                } else {
                    console.error("Transaction error:", confirmedReceipt);
                }
                console.log(receipt)
            } catch (error) {
                console.error("Transaction error:", error);
            }
        }
    }, [provider, signer, address, nft, currentCollection, dispatch])
    return (
        <div className="flex flex-co h-full">
            <NFTCards nfts={nfts} setNft={setNft} handleSend={handleSend} />
        </div>
    )
}