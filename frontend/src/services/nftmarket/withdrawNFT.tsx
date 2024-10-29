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

export const withdrawNFT = async ({ provider, signer, address, nft, collection }: Props) => {
    const contract = await loadNFTCollectionContract({ provider: signer, address: collection.address });

    try {
        const nonce = await provider.getTransactionCount(address, 'latest');
        const receipt = await contract.removeListedNFT(nft.id, {
            nonce: nonce
        })
        await receipt.wait()
        return receipt
    } catch {
        throw new Error("Failed to add buy NFT");
    }
}