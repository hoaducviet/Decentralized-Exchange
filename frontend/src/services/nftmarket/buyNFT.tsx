import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { loadNFTCollectionContract } from '@/utils/loadNFTCollectionContract'
import { loadMarketNFTContract } from '@/utils/loadMarketNFTContract'
import { Address, Collection, NFT } from '@/lib/type'

interface Props {
    provider: BrowserProvider,
    signer: JsonRpcSigner,
    address: Address
    nft: NFT;
    collection: Collection
}

const addressMarketNFT = process.env.NEXT_PUBLIC_ADDRESS_MARKET_NFT as Address
export const buyNFT = async ({ provider, signer, address, nft, collection }: Props) => {
    const contract = await loadNFTCollectionContract({ provider: signer, address: collection.address });
    const market = await loadMarketNFTContract({ provider: signer, address: addressMarketNFT })
    const isApproved = await contract.isApprovedForAll(address, addressMarketNFT);
    if (!isApproved) {
        const tx = await contract.setApprovalForAll(addressMarketNFT, true);
        await tx.wait();
    }
    const balance = await provider.getBalance(address);
    const amount = BigInt(nft.price)
    if (balance < amount) {
        throw new Error("Insufficient balance ether");
    }
    try {
        const nonce = await provider.getTransactionCount(address, 'latest');
        const receipt = await market.buyNFT(collection.address, nft.id, {
            nonce: nonce,
            value: amount
        })
        await receipt.wait()
        return receipt
    } catch (error) {
        console.error("Transaction Error:", error);
        throw new Error("Failed to add buy NFT");
    }
}