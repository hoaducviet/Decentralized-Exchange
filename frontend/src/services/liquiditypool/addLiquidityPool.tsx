import { BrowserProvider, JsonRpcSigner, parseUnits } from 'ethers'
import { ReservePool, Token, Address } from '@/lib/type'
import { loadLiquidContract } from '@/utils/loadLiquidContract'
import { loadTokenContract } from '@/utils/loadTokenContract'

interface Props {
    provider: BrowserProvider,
    signer: JsonRpcSigner,
    address: Address
    pool: ReservePool,
    tokenOne: Token,
    amount1: string,
    amount2: string,
}

export const addLiquidityPool = async ({ provider, signer, address, pool, tokenOne, amount1, amount2 }: Props) => {
    const isEth = pool.info.token2.symbol !== 'ETH' ? false : true;
    const contract = await loadLiquidContract({ provider: signer, address: pool.info.address, isEth: isEth });
    const contractToken1 = await loadTokenContract({ provider: signer, address: pool.info.token1.address })
    const balance1 = await contractToken1.balanceOf(address);

    let value1
    let value2

    if (tokenOne.address === pool.info.token1.address) {
        value1 = parseUnits(amount1.slice(0, amount1.indexOf(".") + pool.info.token1.decimals + 1), pool.info.token1.decimals)
        value2 = parseUnits(amount2.slice(0, amount2.indexOf(".") + pool.info.token2.decimals + 1), pool.info.token2.decimals)
    } else {
        value1 = parseUnits(amount2.slice(0, amount2.indexOf(".") + pool.info.token1.decimals + 1), pool.info.token1.decimals)
        value2 = parseUnits(amount1.slice(0, amount1.indexOf(".") + pool.info.token2.decimals + 1), pool.info.token2.decimals)
    }
    if (balance1 < value1) {
        throw new Error("Insufficient balance for token 1");
    }
    try {
        const nonce1 = await provider.getTransactionCount(address, 'latest');
        const approveTX1 = await contractToken1.approve(pool.info.address, value1, {
            nonce: nonce1
        })
        await approveTX1.wait()
    } catch {
        throw new Error("Failed to approve token 1");
    }

    if (!isEth) {
        const contractToken2 = await loadTokenContract({ provider: signer, address: pool.info.token2.address })
        const balance2 = await contractToken2.balanceOf(address);

        if (balance2 < value2) {
            throw new Error("Insufficient balance for token 2");
        }
        try {
            const nonce2 = await provider.getTransactionCount(address, 'latest');
            const approveTX2 = await contractToken2.approve(pool.info.address, value2, {
                nonce: nonce2
            })
            await approveTX2.wait()

            const nonce3 = await provider.getTransactionCount(address, 'latest');
            const receipt = await contract.addLiquidity(value1, value2, {
                nonce: nonce3
            })
            await receipt.wait()
            return receipt

        } catch {
            throw new Error("Failed to approve token 2");
        }
    } else {
        try {
            const nonce3 = await provider.getTransactionCount(address, 'latest');
            const receipt = await contract.addLiquidity(value1, {
                nonce: nonce3,
                value: value2
            })
            await receipt.wait()
            return receipt
        } catch {
            throw new Error("Failed to add liquidity");
        }
    }
}