'use client'

import { useAccount, useBalance } from 'wagmi'
import tokenList from "@/assets/token/tokenList.json";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Token {
    ticker: string;
    img: string;
    name: string;
    address: `0x${string}`;
    decimals: number;
}

const tokens: Token[] = tokenList as Token[];


export default function TokenBalance() {
    const { address } = useAccount()
    const tokenBalances = tokens.map((token) => {
        const { data: tokenBalance } = useBalance({
            address,
            token: token.address
        })
        return { token, balance: tokenBalance }
    })
    const hasToken = tokenBalances.filter(({ balance }) => !!balance)

    return (
        <div className='flex flex-col w-full'>
            {hasToken && hasToken.map(({ token, balance }) => (
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
                        {Number(balance?.value)}
                        {balance?.symbol}
                    </div>
                </div>
            ))}
        </div>
    )
}