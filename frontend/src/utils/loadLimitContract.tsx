import { BrowserProvider, JsonRpcSigner, Contract } from 'ethers'
import OrderLimit from '@/artifacts/OrderLimit.json';
import { Address } from "@/lib/type"

interface Props {
    provider: BrowserProvider | JsonRpcSigner;
    address: Address;
}

export const loadLimitContract = async ({ provider, address }: Props) => {
    const contract = new Contract(address, OrderLimit.abi, provider)
    return contract
}
