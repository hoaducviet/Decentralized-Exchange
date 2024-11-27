import { Card, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { CheckBadgeIcon } from '@heroicons/react/20/solid'

import { Collection } from '@/lib/type'

interface Props {
    collections: Collection[];
}

const options = ['Colleciton name', 'Floor', 'Volume', 'Volume change', 'Items', 'Owners']

export default function NFTColections({ collections }: Props) {

    return (
        <div className='select-none flex flex-col w-full'>
            <Card className='w-full rounded-2xl shadow-md space-y-3 p-[2.5vw] '>
                <CardTitle className='text-2xl font-semibold'>NFT collections</CardTitle>
                <div className='flex flex-row justify-between items-center text-md font-semibold opacity-70 px-3 h-[3vw]'>
                    <p className='w-[35%]'>{options[0]}</p>
                    <p className='flex flex-row justify-start w-[13%]'>{options[1]}</p>
                    <p className='flex flex-row justify-start w-[13%]'>{options[2]}</p>
                    <p className='flex flex-row justify-start w-[13%]'>{options[3]}</p>
                    <p className='flex flex-row justify-end w-[13%]'>{options[4]}</p>
                    <p className='flex flex-row justify-end w-[13%]'>{options[5]}</p>
                </div>
                <div className='flex flex-col border-t-[1px] w-full'>
                    {collections.length > 0 && collections.map((item, index) => {
                        return (
                            <Link key={index} href={`/nfts/${item.name.toLowerCase().replace(/\s+/g, '')}`} className='flex flex-col w-full'>
                                <div className='cursor-pointer hover:bg-secondary/80 rounded-none flex flex-row items-center px-3 h-[4vw]'>
                                    <div className='flex flex-row items-center space-x-[0.6vw] w-[35%] text-md'>
                                        <p>{index + 1}</p>
                                        <Avatar className="ml-[0.5vw] border-black">
                                            <AvatarImage src={item.logo || '/image/default-nft.png'} />
                                            <AvatarFallback>{item.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <p className='font-semibold oopacity-85'>{item.name}</p>
                                        {item.verified && <CheckBadgeIcon className="w-5 h-5 text-blue-500" />}
                                    </div>
                                    <p className='flex flex-row justify-start w-[13%]'>11.45 ETH</p>
                                    <p className='flex flex-row justify-start w-[13%]'>100 ETH</p>
                                    <p className='flex flex-row justify-start w-[13%]'>100</p>
                                    <p className='flex flex-row justify-end w-[13%]'>100</p>
                                    <p className='flex flex-row justify-end w-[13%]'>123</p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </Card>
        </div>
    )
}