'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TokenActiveTransaction } from '@/lib/type';
import { ArrowRightIcon } from "@radix-ui/react-icons";

interface Props {
    transaction: TokenActiveTransaction;
}

export default function TokenCardAcitve({ transaction }: Props) {
    console.log(transaction)
    const date = new Date(transaction.createdAt);
    const formattedDate = date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return (
        <div className='hover:bg-secondary/80 cursor-pointer flex flex-row items-center px-[1vw] space-x-[0.5vw] border-b-[1px] py-3'>
            <Avatar className="w-[10%] max-w-[5vw] border border-blue-200">
                <AvatarImage src={transaction.from_token_id.symbol === 'USD' ? transaction.to_token_id?.img : transaction.from_token_id.img} alt="NFT" />
                <AvatarFallback>T</AvatarFallback>
            </Avatar>
            <div className='flex flex-col w-[90%] space-y-[0.1vw]'>
                <div className="flex flex-row justify-between items-center text-lg font-semibold opacity-85">
                    <div>{transaction.type}</div>
                    <div className="text-sm font-medium">{formattedDate}</div>
                </div>
                <div className="flex flex-row justify-between items-center text-md font-semibold opacity-85">
                    <div className="flex flex-row justify-start items-center space-x-[0.1vw]">
                        <div className="flex flex-row space-x-[0.2vw]">
                            <div>
                                {transaction.amount_in}
                            </div>
                            <div>
                                {transaction.from_token_id.symbol}
                            </div>
                        </div>
                        {transaction.to_token_id && <>
                            <ArrowRightIcon width={20} height={20} />
                            <div className="flex flex-row space-x-[0.2vw]">
                                <div>
                                    {transaction.amount_out}
                                </div>
                                <div>
                                    {transaction.to_token_id.symbol}
                                </div>
                            </div>
                        </>}
                    </div>
                    {transaction.to_wallet && <>
                        <ArrowRightIcon width={20} height={20} />
                        <div className="flex flex-row space-x-[0.2vw]">
                            <div>Address: </div>
                            <div>
                                {transaction.to_wallet.slice(0, 6) + "..." + transaction.to_wallet.slice(38)}
                            </div>
                        </div>
                    </>}
                </div>
                <div className="flex flex-row text-sm justify-start">
                    <div>{transaction.status}</div>
                </div>
            </div>
        </div>
    )
} 