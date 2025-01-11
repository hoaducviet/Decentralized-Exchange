import { Card, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { CheckBadgeIcon } from '@heroicons/react/20/solid'
import { formatNumber } from '@/utils/formatNumber'
import { formatPrice } from '@/utils/formatPrice'
import { Collection } from '@/lib/type'
import { useGetTokensQuery } from '@/redux/features/api/apiSlice'
import { TagIcon } from "@heroicons/react/20/solid";

interface Props {
    collections: Collection[];
}

const options = ['Colleciton name', 'Volume (ETH)', 'Volume (USD)', 'Floor (ETH)', 'Items', 'Owners']

export default function NFTColections({ collections }: Props) {
    const { data: tokens } = useGetTokensQuery()
    const eth = tokens?.find(item => item.symbol === 'ETH')

    return (
        <Card className='select-none w-full rounded-2xl shadow-md border-white/30 space-y-3 p-[2.5vw] '>
            <CardTitle className='text-2xl font-semibold'>NFT collections</CardTitle>
            <div className='flex flex-row justify-between items-center text-md font-semibold opacity-70 px-3 h-[3vw]'>
                <p className='w-[35%]'>{options[0]}</p>
                <p className='flex flex-row justify-end w-[15%]'>{options[1]}</p>
                <p className='flex flex-row justify-end w-[15%]'>{options[2]}</p>
                <p className='flex flex-row justify-end w-[15%]'>{options[3]}</p>
                <p className='flex flex-row justify-end w-[10%]'>{options[4]}</p>
                <p className='flex flex-row justify-end w-[10%]'>{options[5]}</p>
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
                                    <div className='flex flex-row dark:bg-white/15 items-center space-x-2 border-[0.1px] border-red-100 dark:border-blue-500 rounded-xl text-xs py-1 px-2 shadow-md text-blue-500'>
                                        <TagIcon className='w-[0.8vw] h-[0.8vw] ' />
                                        <p>{item.category}</p>
                                    </div>
                                </div>
                                <div className='flex flex-row justify-end w-[15%]'>{formatNumber(parseFloat(item.volume.slice(0, item.volume.indexOf('.') + 4)))}</div>
                                <div className='flex flex-row justify-end w-[15%]'>${formatPrice(parseFloat(item.volume) * parseFloat(eth?.price || "0")).slice(0, item.volume.indexOf('.') + 3)}</div>
                                <div className='flex flex-row justify-end w-[15%]'>{item.floor_price.slice(0, item.floor_price.indexOf('.') + 4)}</div>
                                <div className='flex flex-row justify-end w-[10%]'>{formatNumber(parseFloat(item.total_items))}</div>
                                <div className='flex flex-row justify-end w-[10%]'>{formatNumber(parseFloat(item.total_owners))}</div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </Card>
    )
}