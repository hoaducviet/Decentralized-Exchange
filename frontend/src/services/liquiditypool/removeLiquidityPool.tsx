import { BrowserProvider, JsonRpcSigner, parseUnits } from 'ethers'
import { Address, LiquidBalancesType } from '@/lib/type'
import { loadLiquidContract } from '@/utils/loadLiquidContract'

interface Props {
    provider: BrowserProvider,
    signer: JsonRpcSigner,
    pool: LiquidBalancesType,
    address: Address
}

export const removeLiquidityPool = async ({ provider, signer, pool, address }: Props) => {
    const isEth = pool?.info.token2?.symbol !== 'ETH' ? false : true;
    const contract = await loadLiquidContract({ provider: signer, address: pool?.info?.address, isEth: isEth });
    const amount = (pool.balance?.formatted ?? "").toString()
    const value = parseUnits(amount, pool.balance?.decimals)

    try {
        const nonce = await provider.getTransactionCount(address, 'latest');
        const receipt = await contract.removeLiquidity(value, { nonce: nonce });
        await receipt.wait()
        return receipt
    } catch {
        throw new Error("Failed to add liquidity");
    }
}