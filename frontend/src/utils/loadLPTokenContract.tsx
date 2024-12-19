import { BrowserProvider, JsonRpcSigner, Contract } from 'ethers'
import LPToken from '@/artifacts/LPToken.json';
import { Address } from "@/lib/type"

interface Props {
    provider: BrowserProvider | JsonRpcSigner;
    address: Address;
}

export const loadLPTokenContract = async ({ provider, address }: Props) => {
    const abi = LPToken.abi;
    const contract = new Contract(address, abi, provider)
    return contract
}