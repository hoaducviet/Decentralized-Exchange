import { BrowserProvider, JsonRpcSigner, parseUnits } from 'ethers'
import { ReservePool, Token, Address } from '@/lib/type'
import { loadLimitContract } from '@/utils/loadLimitContract'
import { loadTokenContract } from '@/utils/loadTokenContract'

interface Props {
    provider: BrowserProvider,
    signer: JsonRpcSigner,
    address: Address,
    addressContract: Address,
    pool: ReservePool,
    tokenOne: Token,
    tokenTwo: Token,
    amount: string,
    price: string;
}

export const swapLimitPool = async ({ provider, signer, address, addressContract, pool, tokenOne, tokenTwo, amount, price }: Props) => {
    const isEth = tokenOne.symbol === 'ETH'
    const limitContract = await loadLimitContract({ provider: signer, address: addressContract });
    const value = parseUnits(amount.slice(0, amount.indexOf(".") + tokenOne.decimals + 1), tokenOne.decimals)
    const priceValue = parseUnits(price.slice(0, price.indexOf(".") + 7), 6)

    try {
        if (!isEth) {
            const contractToken = await loadTokenContract({ provider: signer, address: tokenOne.address })
            const balance = await contractToken.balanceOf(address);
            if (balance < value) {
                throw new Error("Insufficient balance for token 1");
            }
            const nonce1 = await provider.getTransactionCount(address, 'latest');
            const approveTX = await contractToken.approve(addressContract, value, {
                nonce: nonce1
            })
            await approveTX.wait()

        }
        const nonce2 = await provider.getTransactionCount(address, 'latest');
        const receipt = tokenOne.symbol !== 'ETH' ? await limitContract.createOrder(pool.info.address, tokenOne.address, tokenTwo.address, value, priceValue, {
            nonce: nonce2
        }) : await limitContract.createOrder(pool.info.address, tokenOne.address, tokenTwo.address, 0, priceValue, {
            nonce: nonce2,
            value: value,
        })
        await receipt.wait()

        return receipt
    } catch {
        throw new Error("Failed to approve token 1");
    }
} 