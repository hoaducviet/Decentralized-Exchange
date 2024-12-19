import { BrowserProvider, JsonRpcSigner, Contract } from 'ethers'
import NFTCollection from '@/artifacts/NFTCollection.json';
import { Address } from "@/lib/type"

interface Props {
    provider: BrowserProvider | JsonRpcSigner;
    address: Address;
}
export const loadNFTCollectionContract = async ({ provider, address }: Props) => {
    try {
        const abi = NFTCollection.abi;
        const contract = new Contract(address, abi, provider)
        return contract
    } catch (error) {
        console.log(error)
        throw error
    }
}