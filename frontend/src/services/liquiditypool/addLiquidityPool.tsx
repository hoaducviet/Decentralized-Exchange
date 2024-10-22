import { JsonRpcSigner, parseUnits } from 'ethers'
import { LiquidBalancesType, TokenBalancesType, Address } from '@/lib/type'
import { loadLiquidContract } from '@/utils/loadLiquidContract'
import { loadTokenContract } from '@/utils/loadTokenContract'

interface Props {
    signer: JsonRpcSigner,
    address: Address
    pool: LiquidBalancesType,
    tokenOne: TokenBalancesType,
    amount1: string,
    amount2: string,

}

export const addLiquidityPool = async ({ signer, address, pool, tokenOne, amount1, amount2 }: Props) => {
    const isEth = pool?.info.token2?.symbol !== 'ETH' ? false : true;

    console.log(amount1, amount2, tokenOne.info.symbol)

    const contract = await loadLiquidContract({ provider: signer, address: pool?.info?.address, isEth: isEth });
    const contractToken1 = await loadTokenContract({ provider: signer, address: pool.info.addressToken1 })
    const balance1 = await contractToken1.balanceOf(address);

    let value1
    let value2

    if (tokenOne.info.address === pool?.info?.addressToken1) {
        value1 = parseUnits(amount1, pool.info.decimals1)
        value2 = parseUnits(amount2, pool.info.decimals2)
    } else {
        value1 = parseUnits(amount2, pool.info.decimals1)
        value2 = parseUnits(amount1, pool.info.decimals2)
    }
    console.log(value1, value2)

    console.log(balance1, value1)
    if (balance1 < value1) {
        throw new Error("Insufficient balance for token 1");
    }


    const approveTX1 = await contractToken1.approve(pool.info.address, value1)
    await approveTX1.wait()

    if (!isEth) {
        const contractToken2 = await loadTokenContract({ provider: signer, address: pool.info.addressToken2 })
        const balance2 = await contractToken2.balanceOf(address);

        if (balance2 < value2) {
            throw new Error("Insufficient balance for token 2");
        }
        const approveTX2 = await contractToken2.approve(pool.info.address, value2)
        await approveTX2.wait()
    }

    try {

        if (!isEth) {
            console.log(value1, value2)
            const receipt = await contract.addLiquidity(value1, value2)
            await receipt.wait()
            return receipt
        } else {
            console.log(value1, value2)
            const receipt = await contract.addLiquidity(value1, { value: value2 })
            await receipt.wait()
            return receipt
        }
    } catch {
        throw new Error("Failed to add liquidity");
    }
}