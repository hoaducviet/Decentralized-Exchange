'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useWallet } from '@/hooks/useWallet'

export default function TokenBalance() {
    const { balances } = useWallet()
    if (balances.length == 0) return <></>
    return (
        <div className='flex flex-col w-full'>
            {balances.length > 0 && balances.map(({ token, balance }) => (
                <div key={token.address} className='flex flex-row justify-between items-center w-full h-[5.5vh]'>
                    <div className='flex flex-row'>
                        <Avatar className="flex mx-2">
                            <AvatarImage src={token.img} alt={token.name} />
                            <AvatarFallback>Account</AvatarFallback>
                        </Avatar>
                        <div className='flex items-center font-bold'>
                            {token.ticker}
                        </div>
                    </div>
                    <div className='flex flex-row justify-end items-center w-[50%] mr-[3%]'>
                        {balance?.formatted}
                        <div className="flex justify-start items-center ml-[5%] w-[20%]">
                            {balance?.symbol}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}