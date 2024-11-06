
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
    amount: string,
    price: string;
}

export const swapLimitPool = async ({ provider, signer, address, addressContract, pool, tokenOne, amount, price }: Props) => {
    const isEth = pool.info.token2.symbol !== 'ETH' ? false : true;
    const limitContract = await loadLimitContract({ provider: signer, address: addressContract });
    const value = parseUnits(amount.slice(0, amount.indexOf(".") + tokenOne.decimals + 1), tokenOne.decimals)
    const priceValue = price.slice(0, price.indexOf(".") + 7)
    if (!isEth) {
        try {
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
            const nonce2 = await provider.getTransactionCount(address, 'latest');
            /////
            const receipt = await limitContract.sendLimit(priceValue, value, tokenOne.address, pool.info.address, {
                nonce: nonce2
            })
            await receipt.wait()

            return approveTX
        } catch {
            throw new Error("Failed to approve token 1");
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
                const approveTX = await contractToken.approve(addressContract, value, {
                    nonce: nonce1
                })
                await approveTX.wait()
                const nonce2 = await provider.getTransactionCount(address, 'latest');
                const receipt = await limitContract.sendLimit(priceValue, value, tokenOne.address, pool.info.address, {
                    nonce: nonce2
                })
                await receipt.wait()

                return approveTX
            } catch {
                throw new Error("Failed to add liquidity");
            }
        } else {
            try {
                const balance = await provider.getBalance(address)
                if (balance < value) {
                    throw new Error("Insufficient balance for Ether");
                }
                console.log("Balance is eth")
                // const nonce1 = await provider.getTransactionCount(address, 'latest');
                // const receipt = await limitContract.sendLimit(priceValue, BigInt(0), tokenOne.address, pool.info.address, {
                //     nonce: nonce1,
                //     value: value
                // })
                // await receipt.wait()

                return true
            } catch {
                throw new Error("Failed to add liquidity");
            }
        }
    }
}