import { BrowserProvider, JsonRpcSigner, parseEther, parseUnits } from 'ethers'
import { TokenBalancesType, Address } from '@/lib/type'
import { loadTokenContract } from '@/utils/loadTokenContract'

interface Props {
    provider: BrowserProvider,
    signer: JsonRpcSigner,
    address: Address,
    addressTo: Address,
    token: TokenBalancesType,
    amount: string,
}

export const transferToken = async ({ provider, signer, address, addressTo, token, amount }: Props) => {
    const isEth = token.info.symbol !== 'ETH' ? false : true;
    const nonce = await provider.getTransactionCount(address, 'latest')
    if (!isEth) {
        try {
            const contract = await loadTokenContract({ provider: signer, address: token.info.address });
            const value = parseUnits(amount, token.info.decimals)
            const receipt = await contract.transfer(addressTo, value, {
                nonce: nonce
            })
            await receipt.wait()

            return receipt
        } catch {
            throw new Error("Failed to add liquidity");
        }
    } else {
        try {
            const value = parseEther(amount);
            const receipt = await signer.sendTransaction({
                nonce: nonce,
                to: addressTo,
                value: value
            })
            await receipt.wait()

            return receipt
        } catch {
            throw new Error("Failed to add liquidity");
        }
    }
}