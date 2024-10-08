'use client'
import Image from 'next/image'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { Button } from '@/components/ui/button'


import TokenBalance from '@/components/wallet/TokenBalance'


export default function SiderBar() {
    const { address } = useAccount()
    const { disconnect } = useDisconnect()
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

    return (
        <div className='w-full'>
            {ensAvatar && <Image alt="ENS Avatar" src={ensAvatar} />}
            {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}

            <div>
                <TokenBalance />
            </div>
            <Button variant="secondary" className='w-full' onClick={() => disconnect()}>Disconnect</Button>
        </div>
    )
}
