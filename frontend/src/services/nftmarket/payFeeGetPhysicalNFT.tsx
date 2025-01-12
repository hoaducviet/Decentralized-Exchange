import { BrowserProvider, JsonRpcSigner, parseEther } from 'ethers'
import { loadMarketNFTContract } from '@/utils/loadMarketNFTContract'
import { Address, Collection, NFT } from '@/lib/type'
import API from '@/config/configApi';

interface Props {
    provider: BrowserProvider,
    signer: JsonRpcSigner,
    address: Address
    collection: Collection;
    nft: NFT;
    fee: string;
}

const addressMarketNFT = API.addressMarketNFT as Address
export const payFeeGetPhysicalNFT = async ({ provider, signer, address, collection, nft, fee }: Props) => {
    const market = await loadMarketNFTContract({ provider: signer, address: addressMarketNFT })
    const balance = await provider.getBalance(address);
    const amount = parseEther(fee)

    if (balance < amount) {
        throw new Error("Insufficient balance ether");
    }
    try {
        const nonce = await provider.getTransactionCount(address, 'latest');
        const receipt = await market.payFeeGetPhysicalNFT(collection.address, nft.nft_id, amount, {
            nonce: nonce,
            value: amount
        })
        await receipt.wait()
        return receipt
    } catch (error) {
        console.error("Transaction Error:", error);
        throw new Error("Failed to payment fee get physical NFT!");
    }
}