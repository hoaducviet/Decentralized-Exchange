'use clien'
import { useAccount } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NFTActiveTransaction } from '@/lib/type';
import { useGetCollectionQuery } from "@/redux/features/api/apiSlice";

interface Props {
    transaction: NFTActiveTransaction;
}

export default function NFTCardAcitve({ transaction }: Props) {
    const { address } = useAccount()
    const { data } = useGetCollectionQuery({ address, addressCollection: transaction.collection_id?.address })
    const nfts = data?.nfts
    const nft = nfts?.find(nft => nft.id === Number(transaction.nft_id))
    const date = new Date(transaction.createdAt);
    const formattedDate = date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return <div className='hover:bg-secondary/80 cursor-pointer flex flex-row items-center px-[1vw] space-x-[0.5vw] border-b-[1px] py-3'>
        <Avatar className="w-[10%] max-w-[5vw] border border-blue-200">
            <AvatarImage src={nft?.img} alt="NFT" />
            <AvatarFallback>T</AvatarFallback>
        </Avatar>
        <div className='flex flex-col w-[90%] space-y-[0.1vw]'>
            <div className="flex flex-row justify-between items-center text-lg font-semibold opacity-85">
                <div>{transaction.type}</div>
                <div className="text-sm font-medium">{formattedDate}</div>
            </div>
            <div className="flex flex-row justify-between items-center text-md font-semibold opacity-85">
                <div className="">{transaction.collection_id?.name} # {transaction.nft_id}</div>
                <div className="flex flex-row space-x-[0.2vw]">
                    <div>
                        {transaction.price}
                    </div>
                    <div>
                        {transaction.currency}
                    </div>
                </div>
            </div>
            <div className="flex flex-row text-sm justify-start">
                <div>{transaction.status}</div>
            </div>
        </div>
    </div>

} 