'use client'
import { useGetCollectionsQuery } from '@/redux/features/api/apiSlice'
import { Card, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { CheckBadgeIcon } from '@heroicons/react/20/solid'
import { formatNumber } from '@/utils/formatNumber'
import { formatPrice } from '@/utils/formatPrice'
import { PlusCircleIcon, LinkIcon } from "@heroicons/react/24/outline"
import { useGetTokensQuery } from '@/redux/features/api/apiSlice'
import { Button } from "@/components/ui/button"

const options = ['Colleciton name', 'Volume (ETH)', 'Volume (USD)', 'Floor (ETH)', 'Items']
const list = ['Total', "Add Collection", 'Create New Collection']

export default function CollectionAdmin() {
    const { data: collections } = useGetCollectionsQuery()
    const { data: tokens } = useGetTokensQuery()
    const eth = tokens?.find(item => item.symbol === 'ETH')

    return (
        <div className="select-none flex flex-col justify-center items-center w-full  py-[2vw] space-y-[2vw]">
            <div className="flex flex-row w-full justify-between items-center pr-[4vw] text-white">
                <div className="flex flex-col justify-center items-start bg-blue-500 dark:bg-white/10 dark:border-white/40 border-y-[0.1px] border-r-[0.1px] w-[8vw] h-[3.5vw] pl-[1vw] rounded-r-full">
                    <p className="text-xl font-semibold">{list[0]}</p>
                    <p >{`${collections?.length} Collections`}</p>
                </div>
                <div className="flex flex-row justify-end items-center space-x-[1vw]">
                    <div className="cursor-pointer dark:bg-white/10 bg-blue-500 dark:border-white/40 hover:dark:border-blue-500 border-[0.1px] flex flex-row justify-end items-center rounded-2xl shadow-2xl space-x-2 h-[3vw] px-[1vw]">
                        <LinkIcon className="w-[1.5vw] h-[1.5vw]" />
                        <p className="font-semibold ">{list[1]}</p>
                    </div>
                    <div className="cursor-pointer dark:bg-white/10 bg-blue-500 dark:border-white/40 hover:dark:border-blue-500 border-[0.1px] flex flex-row justify-end items-center rounded-2xl shadow-md space-x-2 h-[3vw] px-[1vw]">
                        <PlusCircleIcon className="w-[1.5vw] h-[1.5vw]" />
                        <p className="font-semibold">{list[2]}</p>
                    </div>
                </div>
            </div>
            <div className="w-full px-[4vw]">
                <Card className="flex flex-col w-full rounded-2xl border-[1px] space-y-3 p-[2.5vw] shadow-md max-h-[76vh] overflow-y-auto">
                    <CardTitle className='text-2xl font-semibold'>NFT collections</CardTitle>
                    <div className='flex flex-row justify-between items-center text-md font-semibold opacity-70 px-3 h-[3vw]'>
                        <p className='w-[35%]'>{options[0]}</p>
                        <p className='flex flex-row justify-end w-[15%]'>{options[1]}</p>
                        <p className='flex flex-row justify-end w-[15%]'>{options[2]}</p>
                        <p className='flex flex-row justify-end w-[15%]'>{options[3]}</p>
                        <p className='flex flex-row justify-end w-[10%]'>{options[4]}</p>
                        <div className='flex flex-row justify-end w-[10%]'></div>
                    </div>
                    <div className='flex flex-col border-t-[1px] w-full'>
                        {collections && collections.length > 0 && collections.map((item, index) => {
                            return (
                                <div key={index} className='cursor-pointer hover:bg-secondary/80 rounded-none flex flex-row items-center px-3 h-[4vw]'>
                                    <div className='flex flex-row justify-start items-center space-x-[0.6vw] w-[35%] text-md hover:underline'>
                                        <Link href={`/nfts/${item.name.toLowerCase().replace(/\s+/g, '')}`} className='flex flex-row justify-start items-center space-x-1'>
                                            <p>{index + 1}</p>
                                            <Avatar className="ml-[0.5vw] border-black">
                                                <AvatarImage src={item.logo || '/image/default-nft.png'} />
                                                <AvatarFallback>{item.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <p className='font-semibold oopacity-85'>{item.name}</p>
                                            {item.verified && <CheckBadgeIcon className="w-5 h-5 text-blue-500 " />}
                                        </Link>
                                    </div>
                                    <div className='flex flex-row justify-end w-[15%]'>{formatNumber(parseFloat(item.volume.slice(0, item.volume.indexOf('.') + 4)))}</div>
                                    <div className='flex flex-row justify-end w-[15%]'>${formatPrice(parseFloat(item.volume) * parseFloat(eth?.price || "0")).slice(0, item.volume.indexOf('.') + 3)}</div>
                                    <div className='flex flex-row justify-end w-[15%]'>{item.floor_price.slice(0, item.floor_price.indexOf('.') + 4)}</div>
                                    <div className='flex flex-row justify-end w-[10%]'>{formatNumber(parseFloat(item.total_items))}</div>
                                    <div className="flex flex-row justify-end w-[10%] space-x-[0.5vw]">
                                        <Button variant="outline">Delete</Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            </div>
        </div>

    )
}