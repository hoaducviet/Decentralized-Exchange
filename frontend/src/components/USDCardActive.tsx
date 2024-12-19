'use clien'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { USDActiveTransaction } from '@/lib/type';


interface Props {
    transaction: USDActiveTransaction;
}

export default function USDCardAcitve({ transaction }: Props) {

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
            <AvatarImage src={"/image/paypal-icon.png"} alt="NFT" />
            <AvatarFallback>T</AvatarFallback>
        </Avatar>
        <div className='flex flex-col w-[90%] space-y-[0.1vw]'>
            <div className="flex flex-row justify-between items-center text-lg font-semibold opacity-85">
                <div>{transaction.type}</div>
                <div className="text-sm font-medium">{formattedDate}</div>
            </div>
            <div className="flex flex-row justify-between items-center text-md font-semibold opacity-85">
                <div className="">{transaction.method}</div>
                <div className="flex flex-row space-x-[0.2vw]">
                    <div>
                        {transaction.amount}
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