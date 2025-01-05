import { BrowserProvider, JsonRpcSigner, parseEther } from 'ethers'
import { loadMarketNFTContract } from '@/utils/loadMarketNFTContract'
import { Address, PendingCollection } from '@/lib/type'
import API from '@/config/configApi';

interface Props {
    provider: BrowserProvider,
    signer: JsonRpcSigner,
    address: Address
    collection: PendingCollection;
}

const addressMarketNFT = API.addressMarketNFT as Address
export const payFeeExpert = async ({ provider, signer, address, collection }: Props) => {
    const market = await loadMarketNFTContract({ provider: signer, address: addressMarketNFT })
    const balance = await provider.getBalance(address);
    const amount = parseEther(collection.fee_expert)
    if (balance < amount) {
        throw new Error("Insufficient balance ether");
    }
    try {
        const nonce = await provider.getTransactionCount(address, 'latest');
        const receipt = await market.payFeeExpert(collection._id, amount, {
            nonce: nonce,
            value: amount
        })
        await receipt.wait()
        return receipt
    } catch (error) {
        console.error("Transaction Error:", error);
        throw new Error("Failed to payment fee expert!");
    }
}