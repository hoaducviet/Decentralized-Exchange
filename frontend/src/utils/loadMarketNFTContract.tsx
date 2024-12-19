import { BrowserProvider, Contract, JsonRpcSigner } from 'ethers'
import MarketNFT from '@/artifacts/MarketNFT.json';
import { Address } from "@/lib/type"

interface Props {
    provider: BrowserProvider | JsonRpcSigner;
    address: Address;
}

export const loadMarketNFTContract = async ({ provider, address }: Props) => {
    const contract = new Contract(address, MarketNFT.abi, provider)
    return contract
}
