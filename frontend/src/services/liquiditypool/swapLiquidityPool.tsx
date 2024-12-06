import { BrowserProvider, JsonRpcSigner, parseUnits } from 'ethers'
import { loadLiquidContract } from '@/utils/loadLiquidContract'
import { loadTokenContract } from '@/utils/loadTokenContract'
import { ReservePool, Token, Address } from '@/lib/type'

interface Props {
    provider: BrowserProvider,
    signer: JsonRpcSigner,
    address: Address
    pool: ReservePool,
    tokenOne: Token,
    amount: string,
}

export const swapLiquidityPool = async ({ provider, signer, address, pool, tokenOne, amount }: Props) => {
    const isEth = pool.info.token2.symbol === 'ETH'
    const contract = await loadLiquidContract({ provider: signer, address: pool.info.address, isEth: isEth });
    const value = parseUnits(amount.slice(0, amount.indexOf(".") + tokenOne.decimals + 1), tokenOne.decimals)

    if (!isEth) {
        try {
            const contractToken = await loadTokenContract({ provider: signer, address: tokenOne.address })
            const balance = await contractToken.balanceOf(address);
            if (balance < value) {
                throw new Error("Insufficient balance for token 1");
            }
            const nonce1 = await provider.getTransactionCount(address, 'latest');
            const approveTX = await contractToken.approve(pool.info.address, value, {
                nonce: nonce1
            })
            await approveTX.wait()
            const nonce2 = await provider.getTransactionCount(address, 'latest');
            const receipt = await contract.swapToken(tokenOne.address, value, {
                nonce: nonce2
            })
            await receipt.wait()

            return receipt
        } catch (error) {
            throw new Error(`Failed to approve token 1: ${error}`);
        }
    } else {
        if (tokenOne.symbol !== 'ETH') {
            try {
                const contractToken = await loadTokenContract({ provider: signer, address: tokenOne.address })
                const balance = await contractToken.balanceOf(address);
                if (balance < value) {
                    throw new Error("Insufficient balance for token 1");
                }
                const nonce1 = await provider.getTransactionCount(address, 'latest');
                const approveTX = await contractToken.approve(pool.info.address, value, {
                    nonce: nonce1
                })
                await approveTX.wait()
                const nonce2 = await provider.getTransactionCount(address, 'latest');
                const receipt = await contract.swapToken(tokenOne.address, value, {
                    nonce: nonce2
                })
                await receipt.wait()

                return receipt
            } catch {
                throw new Error("Failed to swap token");
            }
        } else {
            try {
                const balance = await provider.getBalance(address)
                if (balance < value) {
                    throw new Error("Insufficient balance for Ether");
                }
                const nonce1 = await provider.getTransactionCount(address, 'latest');
                const receipt = await contract.swapToken(tokenOne.address, BigInt(0), {
                    nonce: nonce1,
                    value: value
                })
                await receipt.wait()

                return receipt
            } catch {
                throw new Error("Failed to swap token");
            }
        }
    }
}