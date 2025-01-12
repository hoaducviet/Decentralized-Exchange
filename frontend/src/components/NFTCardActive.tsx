'use clien'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NFTActiveTransaction } from '@/lib/type';
import { useGetNFTItemQuery } from "@/redux/features/api/apiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
interface Props {
    transaction: NFTActiveTransaction;
}

export default function NFTCardAcitve({ transaction }: Props) {
    const { data: nft } = useGetNFTItemQuery(transaction?.collection_id?._id && transaction?.nft_id ? { collectionId: transaction.collection_id._id, nftId: transaction?.nft_id } : skipToken)
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
                <div className="text-xs italic font-medium">{formattedDate}</div>
            </div>
            <div className="flex flex-row justify-between items-center text-md font-semibold opacity-85">
                <div className="">{transaction.collection_id?.name} #{transaction.nft_id}</div>
                {transaction.type !== 'Transfer NFT' && transaction.type !== 'Receive Physical NFT' &&
                    <div className="flex flex-row space-x-[0.2vw]">
                        <div>
                            {transaction.price}
                        </div>
                        <div>
                            {transaction.currency}
                        </div>
                    </div>
                }
            </div>
            <div className="flex flex-row justify-between text-xs italic">
                <div>{transaction.status}</div>
                {transaction.type === 'Transfer NFT' &&
                    <div>To: {transaction.to_wallet?.slice(2,8)}</div>
                }
            </div>
        </div>
    </div>

} 