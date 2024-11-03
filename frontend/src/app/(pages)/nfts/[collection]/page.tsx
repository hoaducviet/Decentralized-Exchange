'use client'
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useAccount } from "wagmi";
import { useCollection } from "@/hooks/useCollection"
import { useWeb3 } from "@/hooks/useWeb3";
import { useGetCollectionQuery } from "@/redux/features/api/apiSlice";
import { resetNFTs } from "@/redux/features/collection/collectionSlice";
import { buyNFT } from "@/services/nftmarket/buyNFT"
import NFTCards from "@/components/nfts/NFTCards"
import { NFT } from "@/lib/type";


export default function CollectionNFT() {
    const dispatch = useDispatch()
    const { currentCollection } = useCollection()
    const [nft, setNft] = useState<NFT | undefined>(undefined)
    const web3 = useWeb3()
    const signer = web3?.signer
    const provider = web3?.provider
    const { address } = useAccount()
    const { data, isFetching } = useGetCollectionQuery({ address, addressCollection: currentCollection?.address })
    const nfts = data?.nfts

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
            {!isFetching && nfts && <NFTCards nfts={nfts} setNft={setNft} handleSend={handleSend} />}
        </div>
    )
}