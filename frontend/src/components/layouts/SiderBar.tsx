'use client'
import Image from 'next/image'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName, useBalance } from 'wagmi'
import { Button } from '@/components/ui/button'

type TokenAddress = `0x${string}`;

const tokenAddress: TokenAddress[] = [
    '0xd38E5c25935291fFD51C9d66C3B7384494bb099A',
    '0x419Fe9f14Ff3aA22e46ff1d03a73EdF3b70A62ED'
]

export default function SiderBar() {
    const { address } = useAccount()
    const { disconnect } = useDisconnect()
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

    const tokenBalances = tokenAddress.map((token) => {
        const { data: tokenBalance } = useBalance({
            address,
            token
        })
        return { token, balance: tokenBalance }
    })

    const hasToken = tokenBalances.filter(({ balance}) => !!balance)

    console.log(hasToken)
    return (
        <div className='w-full'>
            {ensAvatar && <Image alt="ENS Avatar" src={ensAvatar} />}
            {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
            <Button className='w-full' onClick={() => disconnect()}>Disconnect</Button>
        </div>
    )
}
