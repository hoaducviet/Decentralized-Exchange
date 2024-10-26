import { BrowserProvider, JsonRpcSigner, Contract } from 'ethers'
import LiquidityPool from '@/artifacts/LiquidityPool.json';
import LiquidityPoolETH from '@/artifacts/LiquidityPoolETH.json';
import { Address } from "@/lib/type"

interface Props {
    provider: BrowserProvider | JsonRpcSigner;
    address: Address;
    isEth?: boolean;
}

export const loadLimitContract = async ({ provider, address, isEth = false }: Props) => {
    const abi = isEth ? LiquidityPoolETH.abi : LiquidityPool.abi;
    const contract = new Contract(address, abi, provider)
    return contract
}
