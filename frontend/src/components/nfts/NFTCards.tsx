'use client'
import { Dispatch, SetStateAction } from "react";
import NFTItem from "@/components/nfts/NFTItem"
import { Address, NFT } from "@/lib/type";
interface Props {
    nfts: NFT[];
    setNft: Dispatch<SetStateAction<NFT | undefined>>;
    handleSend: () => Promise<void>;
    address: Address | undefined;
    collectionName: string;
}
export default function NFTCards({ nfts, setNft, handleSend, address, collectionName }: Props) {
    return (
        <div className="flex flex-wrap flex-start gap-x-[1.5%] gap-y-[1vw]">
            {nfts.length && collectionName && nfts.map((nft, index) => {
                return (
                    <div key={index} className="w-[18.8%]">
                        <NFTItem nft={nft} setNft={setNft} handleSend={handleSend} address={address} collectionName={collectionName} />
                    </div>
                )
            })}
        </div>
    )
}