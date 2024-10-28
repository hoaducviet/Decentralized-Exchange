import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { Address, Collection, NFT } from '@/lib/type'
import { loadNFTCollectionContract } from '@/utils/loadNFTCollectionContract'

interface Props {
    provider: BrowserProvider,
    signer: JsonRpcSigner,
    address: Address
    nft: NFT;
    collection: Collection
}

export const buyNFT = async ({ provider, signer, address, nft, collection }: Props) => {
    const contract = await loadNFTCollectionContract({ provider: signer, address: collection.address });
    const balance = await provider.getBalance(address);
    const amount = BigInt(nft.price)
    if (balance < amount) {
        throw new Error("Insufficient balance ether");
    }

    try {
        const nonce = await provider.getTransactionCount(address, 'latest');
        const receipt = await contract.buyNFT(nft.id, {
            nonce: nonce,
            value: amount
        })
        await receipt.wait()
        console.log(receipt)
        return receipt
    } catch {
        throw new Error("Failed to add buy NFT");
    }
}