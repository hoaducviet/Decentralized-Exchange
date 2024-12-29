import { Card, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { formatNumber } from '@/utils/formatNumber'
import { PendingCollection } from '@/lib/type'
import { CommitIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'

interface Props {
    collections: PendingCollection[];
}

const options = ['Colleciton name', 'Owner', 'Create At', 'Items', 'Status', 'Action']
export default function NFTColectionsPending({ collections }: Props) {

    return (
        <Card className='select-none w-full rounded-2xl shadow-md border-[1px] space-y-3 p-[2.5vw] '>
            <CardTitle className='text-2xl font-semibold'>My Collections Pending</CardTitle>
            <div className='flex flex-row justify-between items-center text-md font-semibold opacity-70 px-3 h-[3vw]'>
                <p className='w-[25%]'>{options[0]}</p>
                <p className='flex flex-row justify-end w-[15%]'>{options[1]}</p>
                <p className='flex flex-row justify-end w-[15%]'>{options[2]}</p>
                <p className='flex flex-row justify-end w-[10%]'>{options[3]}</p>
                <p className='flex flex-row justify-end w-[15%]'>{options[4]}</p>
                <p className='flex flex-row justify-end w-[20%]'>{options[5]}</p>
            </div>
            <div className='flex flex-col border-t-[1px] w-full'>
                {collections.length > 0 && collections.map((item, index) => {
                    return (
                        <div key={index} className='cursor-pointer hover:bg-secondary/80 rounded-none flex flex-row items-center px-3 h-[4vw]'>
                            <Link href={`/nfts/personal/${item.name.toLowerCase().replace(/\s+/g, '')}`} className='hover:underline w-[80%] flex flex-row items-center'>
                                <div className='flex flex-row items-center space-x-[0.6vw] w-[31.25%] text-md'>
                                    <p>{index + 1}</p>
                                    <Avatar className="ml-[0.5vw] border-black">
                                        <AvatarImage src={item.logo || '/image/default-nft.png'} />
                                        <AvatarFallback>{item.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <p className='font-semibold oopacity-85'>{item.name}</p>
                                </div>
                                <div className='flex flex-row justify-end items-center w-[18.75%]'>{item.owner.slice(0, 8)}</div>
                                <div className='flex flex-row justify-end items-center w-[18.75%]'>{(new Date(item.createdAt || '')).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                <div className='flex flex-row justify-end items-center w-[12.5%]'>{formatNumber(parseFloat(item.total_items))}</div>
                                <div className="w-[18.75%] flex flex-row justify-end items-center space-x-2">
                                    {
                                        item.status === 'Accepted' ?
                                            <CommitIcon className="w-[1vw] h-[1vw] stroke-green-600" />
                                            : item.status === 'Pending' ?
                                                <CommitIcon className="w-[1vw] h-[1vw] stroke-yellow-600" />
                                                :
                                                <CommitIcon className="w-[1vw] h-[1vw] stroke-red-600" />
                                    }
                                    <p>{item.status}</p>
                                </div>
                            </Link>
                            <div className="w-[20%] flex flex-row justify-end items-center space-x-1">
                                {
                                    item.status === 'Accepted' &&
                                    <Button variant="outline">Pay Fee</Button>
                                }
                                {
                                    item.status === 'Pending' && <>
                                        <Button variant="outline">Pay Fee Expert</Button>
                                        <Button variant="outline">Agree</Button>
                                    </>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card >
    )
}