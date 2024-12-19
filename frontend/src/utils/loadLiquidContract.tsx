import { BrowserProvider, JsonRpcSigner, Contract, JsonRpcProvider } from 'ethers'
import LiquidityPool from '@/artifacts/LiquidityPool.json';
import LiquidityPoolETH from '@/artifacts/LiquidityPoolETH.json';
import { Address } from "@/lib/type"

interface Props {
    provider: BrowserProvider | JsonRpcSigner | JsonRpcProvider;
    address: Address;
    isEth?: boolean;
}

export const loadLiquidContract = async ({ provider, address, isEth = false }: Props) => {
    const abi = isEth ? LiquidityPoolETH.abi : LiquidityPool.abi;
    const contract = new Contract(address, abi, provider)
    return contract
}
