'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useWallet } from '@/hooks/useWallet'

export default function TokenBalance() {
    const { balances } = useWallet()
    // console.log(balances)

    return (
        <div className='flex flex-col w-full'>
            {balances.length > 0 && balances.map(({ token, balance }) => (
                <div key={token.address} className='flex flex-row justify-between'>
                    <div className='flex flex-row'>
                        <Avatar className="flex mx-2">
                            <AvatarImage src={token.img} alt={token.name} />
                            <AvatarFallback>Account</AvatarFallback>
                        </Avatar>
                        <div className='flex items-center font-bold'>
                            {token.ticker}
                        </div>
                    </div>
                    <div className='flex flex-row items-center'>
                        {balance?.value}
                        {balance?.symbol}
                    </div>
                </div>
            ))}
        </div>
    )
}