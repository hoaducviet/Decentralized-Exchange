import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { Address, Collection, NFT } from '@/lib/type'
import { loadNFTCollectionContract } from '@/utils/loadNFTCollectionContract'
import { loadMarketNFTContract } from '@/utils/loadMarketNFTContract'
import API from '@/config/configApi'

interface Props {
    provider: BrowserProvider,
    signer: JsonRpcSigner,
    address: Address
    nft: NFT;
    collection: Collection
}

const addressMarketNFT = API.addressMarketNFT as Address
export const withdrawNFT = async ({ provider, signer, address, nft, collection }: Props) => {
    const contract = await loadNFTCollectionContract({ provider: signer, address: collection.address });
    const market = await loadMarketNFTContract({ provider: signer, address: addressMarketNFT })
    const isApproved = await contract.isApprovedForAll(address, addressMarketNFT);
    try {
        if (!isApproved) {
            const nonce1 = await provider.getTransactionCount(address, 'latest');
            const tx = await contract.setApprovalForAll(addressMarketNFT, true, { nonce: nonce1 });
            await tx.wait();
        }
        const nonce2 = await provider.getTransactionCount(address, 'latest');
        const receipt = await market.removeListedNFT(collection.address, nft.nft_id, {
            nonce: nonce2
        })
        await receipt.wait()
        return receipt
    } catch {
        throw new Error("Failed to add buy NFT");
    }
}