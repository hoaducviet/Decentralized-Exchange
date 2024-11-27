import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { Address, Collection, NFT } from '@/lib/type'
import { loadNFTCollectionContract } from '@/utils/loadNFTCollectionContract'
import { loadMarketNFTContract } from '@/utils/loadMarketNFTContract'

interface Props {
    provider: BrowserProvider,
    signer: JsonRpcSigner,
    address: Address
    nft: NFT,
    collection: Collection,
    to: Address
}

const addressMarketNFT = process.env.NEXT_PUBLIC_ADDRESS_MARKET_NFT as Address
export const transferNFT = async ({ provider, signer, address, nft, collection, to }: Props) => {
    const contract = await loadNFTCollectionContract({ provider: signer, address: collection.address });
    const market = await loadMarketNFTContract({ provider: signer, address: addressMarketNFT })
    const isApproved = await contract.isApprovedForAll(address, addressMarketNFT);
    if (!isApproved) {
        const tx = await contract.setApprovalForAll(addressMarketNFT, true);
        await tx.wait();
    }
    try {
        const nonce = await provider.getTransactionCount(address, 'latest');
        const receipt = await market.transferNFT(collection.address, to, nft.id, {
            nonce: nonce,
        })
        await receipt.wait()
        return receipt
    } catch {
        throw new Error("Failed to add buy NFT");
    }
}