'use client'

import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import AddressBalance from '@/components/AddressBalance'
import ActionsManagement from '@/components/ActionsManagement'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { LayersIcon } from '@radix-ui/react-icons'

export default function SiderBar() {
    const { address } = useAccount()
    const { disconnect } = useDisconnect()
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! })
    const addressConfig = (address ? address.slice(0, 6) + "..." + address.slice(38) : "")

    return (
        <div className=' absolute flex flex-col w-full max-h-[100vh] overflow-x-auto z-10'>
            <div className='flex flex-col'>
                <div className='flex justify-between m-[0.5vw]'>
                    <div className='flex flex-row justify-start items-center'>
                        <Avatar className='mr-[0.5vw]'>
                            <AvatarImage src={ensAvatar || '/image/default-image.png'} />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col justify-center text-lg font-medium '>
                            {ensName ? <p>{ensName}</p> : <p>anonymous</p>}
                            <div className='flex flex-row'>
                                {address && <p className='text-sm ml-[0.1vw]'>{addressConfig}</p>}
                                <Button variant="ghost" className='h-2 p-2' >
                                    <LayersIcon />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Button variant="secondary" className='bg-transparent flex justify-center items-center rounded-3xl w-[30%] mx-[1vw]' onClick={() => disconnect()}>Disconnect</Button>

                </div>
                <div className='flex flex-col items-center w-full z-100'>
                    <ActionsManagement />
                </div>
            </div>
            <div className='w-full'>
                <AddressBalance />
            </div>
        </div>
    )
}
