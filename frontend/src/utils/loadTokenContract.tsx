import { BrowserProvider, JsonRpcSigner, Contract } from 'ethers'
import TokenERC20 from '@/artifacts/TokenERC20.json';
import { Address } from "@/lib/type"

interface Props {
    provider: BrowserProvider | JsonRpcSigner;
    address: Address;
}

export const loadTokenContract = async ({ provider, address }: Props) => {
    const abi = TokenERC20.abi;
    const contract = new Contract(address, abi, provider)
    return contract
}