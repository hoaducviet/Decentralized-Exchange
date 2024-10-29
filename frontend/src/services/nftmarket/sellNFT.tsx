import { BrowserProvider, JsonRpcSigner, parseEther } from 'ethers'
import { Address, Collection, NFT } from '@/lib/type'
import { loadNFTCollectionContract } from '@/utils/loadNFTCollectionContract'

interface Props {
    provider: BrowserProvider,
    signer: JsonRpcSigner,
    address: Address
    nft: NFT;
    collection: Collection,
    amount: string
}

export const sellNFT = async ({ provider, signer, address, nft, collection, amount }: Props) => {
    const contract = await loadNFTCollectionContract({ provider: signer, address: collection.address });

    const value = parseEther(amount)

    try {
        const nonce = await provider.getTransactionCount(address, 'latest');
        const receipt = await contract.listNFT(nft.id, value, {
            nonce: nonce,
        })
        await receipt.wait()
        console.log(receipt)
        return receipt
    } catch {
        throw new Error("Failed to add buy NFT");
    }
}