import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { loadNFTMarketContract } from '@/utils/loadNFTMarketContract'
import { Collection, Address } from "@/lib/type"

interface Props {
    provider: BrowserProvider | JsonRpcSigner;
}

const address: Address = process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as Address
export const getCollectionsNFT = async ({ provider }: Props) => {
    try {
        const contract = await loadNFTMarketContract({ provider, address })
        const result: [] = await contract.getAllCollection();
        const collections: Collection[] = result.map(result => {
            return ({
                address: result[0],
                name: result[1],
                symbol: result[2]
            })
        })

        return collections
    } catch (error) {
        console.error(`Error processing`, error);
        throw error;
    }
}