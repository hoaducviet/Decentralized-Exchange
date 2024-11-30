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
    try {
        if (!isApproved) {
            const nonce1 = await provider.getTransactionCount(address, 'latest');
            const tx = await contract.setApprovalForAll(addressMarketNFT, true, { nonce: nonce1, });
            await tx.wait();
        }
        const nonce2 = await provider.getTransactionCount(address, 'latest');
        const receipt = await market.transferNFT(collection.address, to, nft.nft_id, {
            nonce: nonce2,
        })
        await receipt.wait()
        return receipt
    } catch {
        throw new Error("Failed to add buy NFT");
    }
}