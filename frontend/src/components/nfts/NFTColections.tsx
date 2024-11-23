import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { CheckBadgeIcon } from '@heroicons/react/20/solid'

import { Collection } from '@/lib/type'

interface Props {
    collections: Collection[];
}

export default function NFTColections({ collections }: Props) {

    return (
        <div className='select-none flex flex-col w-full'>
            <p className='text-2xl font-semibold'>NFT collections</p>
            <Card className='w-full border-none outline-none shadow-sm'>
                <div className='flex flex-row justify-start items-center h-[3vw]'>
                    <p className='w-[35%]'>Collection name</p>
                    <div className='flex flex-row justify-start w-[65%]'>
                        <p className='flex flex-row justify-start w-[20%]'>Floor</p>
                        <p className='flex flex-row justify-start w-[20%]'>Volume</p>
                        <p className='flex flex-row justify-start w-[20%]'>Volume change</p>
                        <p className='flex flex-row justify-start w-[20%]'>Items</p>
                        <p className='flex flex-row justify-start w-[20%]'>Owners</p>
                    </div>
                </div>
                <div className='flex flex-col w-full'>
                    {collections.length > 0 && collections.map((item, index) => {
                        return (
                            <Link key={index} href={`/nfts/${item.name.toLowerCase().replace(/\s+/g, '')}`} className='flex flex-col w-full'>
                                <div className='cursor-pointer hover:bg-secondary/80 rounded-none flex flex-row items-center h-[4vw]'>
                                    <div className='flex flex-row items-center space-x-[0.5vw] w-[35%] text-md'>
                                        <p>{index + 1}</p>
                                        <Avatar className="ml-[0.5vw]">
                                            <AvatarImage src={'/image/default-nft.png'} />
                                            <AvatarFallback>{item.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <p className='font-medium'>{item.name}</p>
                                        <CheckBadgeIcon className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div className='flex flex-row justify-between items-center text-md font-medium w-[65%]'>
                                        <p className='flex flex-row justify-start w-[20%]'>11.45 ETH</p>
                                        <p className='flex flex-row justify-start w-[20%]'>100 ETH</p>
                                        <p className='flex flex-row justify-start w-[20%]'>100</p>
                                        <p className='flex flex-row justify-start w-[20%]'>100</p>
                                        <p className='flex flex-row justify-start w-[20%]'>123</p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </Card>
        </div>
    )
}