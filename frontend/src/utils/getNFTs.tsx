import { JsonRpcSigner, formatEther } from 'ethers'
import { loadNFTCollectionContract } from '@/utils/loadNFTCollectionContract'
import { fetchDataURI } from '@/utils/fetchDataURI';
import { convertToHttps } from '@/utils/convertToHttps';
import { NFT, Address } from "@/lib/type"

interface Props {
    provider: JsonRpcSigner;
    address: Address;
}

export const getNFTs = async ({ provider, address }: Props) => {
    try {
        const contract = await loadNFTCollectionContract({ provider, address })
        const results: [] = await contract.getAllNFTInfo();
        const nfts: NFT[] = (await Promise.all(results.map(async (result) => {
            const response = await fetchDataURI({ uri: result[2] })
            const img = response.image ? convertToHttps({ uri: response.image }) : ""
            const formatted = formatEther(result[1])
            return ({
                id: Number(result[0]),
                price: Number(result[1]),
                uri: result[2],
                isListed: result[3],
                owner: result[4],
                formatted: formatted.slice(0, formatted.indexOf('.') + 7),
                img: img,
                name: response.name,
                description: response.description
            })
        }))).filter(item => item.id !== 0)


        const listed = nfts.filter(item => item.isListed)
        const mylist = nfts.filter(item => item.owner === provider.address)

        return { NFTs: nfts, Listed: listed, Mylist: mylist }
    } catch (error) {
        console.error(`Error processing`, error);
        throw error;
    }
}