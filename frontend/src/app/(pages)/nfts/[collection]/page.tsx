'use client'
import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "ethers"
import { useCollection } from "@/hooks/useCollection"
import { useWeb3 } from "@/hooks/useWeb3";
import { useAddNftTransactionMutation, useUpdateNftTransactionMutation, useGetCollectionQuery } from "@/redux/features/api/apiSlice";
import { buyNFT } from "@/services/nftmarket/buyNFT"
import NFTCards from "@/components/nfts/NFTCards"
import { NFT } from "@/lib/type";

export default function CollectionNFT() {
    const { currentCollection } = useCollection()
    const [nft, setNft] = useState<NFT | undefined>(undefined)
    const web3 = useWeb3()
    const signer = web3?.signer
    const provider = web3?.provider
    const { address } = useAccount()
    const [addNftTransaction] = useAddNftTransactionMutation()
    const [updateNftTransaction] = useUpdateNftTransactionMutation()
    const { data, isFetching } = useGetCollectionQuery({ address, addressCollection: currentCollection?.address })
    const nfts = data?.nfts

    const handleSend = useCallback(async () => {
        if (!!provider && !!signer && !!address && !!nft && !!currentCollection) {
            const { data: newTransaction } = await addNftTransaction({
                type: 'Buy NFT',
                from_wallet: address,
                collection_id: currentCollection._id,
                nft_id: nft.id.toString(),
                price: nft.formatted,
            })
            try {
                const receipt = await buyNFT({ provider, signer, address, nft, collection: currentCollection })
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
    return (
        <div className="flex flex-co h-full">
            {!isFetching && nfts && <NFTCards nfts={nfts} setNft={setNft} handleSend={handleSend} address={address} />}
        </div>
    )
}