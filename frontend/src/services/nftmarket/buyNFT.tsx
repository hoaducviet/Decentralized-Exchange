import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { loadNFTCollectionContract } from '@/utils/loadNFTCollectionContract'
import { loadMarketNFTContract } from '@/utils/loadMarketNFTContract'
import { Address, Collection, NFT } from '@/lib/type'
import API from '@/config/configApi'

interface Props {
    provider: BrowserProvider,
    signer: JsonRpcSigner,
    address: Address
    nft: NFT;
    collection: Collection
}

const addressMarketNFT = API.addressMarketNFT as Address
export const buyNFT = async ({ provider, signer, address, nft, collection }: Props) => {
    const contract = await loadNFTCollectionContract({ provider: signer, address: collection.address });
    const market = await loadMarketNFTContract({ provider: signer, address: addressMarketNFT })
    const isApproved = await contract.isApprovedForAll(address, addressMarketNFT);
    const balance = await provider.getBalance(address);
    const amount = BigInt(nft.price)
    if (balance < amount) {
        throw new Error("Insufficient balance ether");
    }
    try {
        if (!isApproved) {
            const nonce1 = await provider.getTransactionCount(address, 'latest');
            const tx = await contract.setApprovalForAll(addressMarketNFT, true, { nonce: nonce1 });
            await tx.wait();
        }
        const nonce2 = await provider.getTransactionCount(address, 'latest');
        const receipt = await market.buyNFT(collection.address, nft.nft_id, {
            nonce: nonce2,
            value: amount
        })
        await receipt.wait()
        return receipt
    } catch (error) {
        console.error("Transaction Error:", error);
        throw new Error("Failed to add buy NFT");
    }
}