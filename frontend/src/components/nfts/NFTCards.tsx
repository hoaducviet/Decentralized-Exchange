'use client'
import { Dispatch, SetStateAction } from "react";
import NFTItem from "@/components/nfts/NFTItem"
import { Address, Collection, NFT } from "@/lib/type";
interface Props {
    nfts: NFT[];
    setNft: Dispatch<SetStateAction<NFT | undefined>>;
    handleSend: () => Promise<void>;
    address: Address | undefined;
    isConnected: boolean;
    collectionName: string;
    balance: string;
    collection: Collection | undefined;
}
export default function NFTCards({ nfts, setNft, handleSend, address, isConnected, collectionName, collection, balance }: Props) {
    return (
        <div className="flex flex-wrap flex-start gap-x-[1.5%] gap-y-[1vw]">
            {nfts.length && collectionName && nfts.map((nft, index) => {
                return (
                    <div key={index} className="w-[18.8%]">
                        <NFTItem nft={nft} setNft={setNft} handleSend={handleSend} address={address} isConnected={isConnected} collectionName={collectionName} collection={collection} balance={balance} />
                    </div>
                )
            })}
        </div>
    )
} 