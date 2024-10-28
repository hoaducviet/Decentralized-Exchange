import { BrowserProvider, JsonRpcSigner, Contract } from 'ethers'
import NFTMarket from '@/artifacts/NFTMarket.json';
import { Address } from "@/lib/type"

interface Props {
    provider: BrowserProvider | JsonRpcSigner;
    address: Address;
}
export const loadNFTMarketContract = async ({ provider, address }: Props) => {
    try {
        const abi = NFTMarket.abi;
        const contract = new Contract(address, abi, provider)
        return contract
    } catch (error) {
        console.log(error)
        throw error
    }
}