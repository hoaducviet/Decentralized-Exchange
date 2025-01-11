import { Card, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { formatNumber } from '@/utils/formatNumber'
import { PendingCollection } from '@/lib/type'
import { Button } from '@/components/ui/button'
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription } from "@/components/ui/alert-dialog";
import Image from 'next/image'
import { useCallback, useState } from 'react'
import { useAgreePriceCollectionMutation } from '@/redux/features/api/apiSlice'
import { payFeeExpert } from '@/services/nftmarket/payFeeExpert'
import { useWeb3 } from '@/hooks/useWeb3'
import { useAccount } from 'wagmi'
import { payFeeCollection } from '@/services/nftmarket/payFeeCollection'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { TagIcon } from "@heroicons/react/20/solid";

interface Props {
    collections: PendingCollection[];
}

const options = ['Colleciton name', 'Items', 'Fee(ETH)', 'Admin', 'User', 'Status', 'Action']
export default function NFTColectionsPending({ collections }: Props) {
    const { address } = useAccount()
    const { signer, provider } = useWeb3() || {}
    const [currentCollection, setCurrentCollection] = useState<PendingCollection | undefined>(undefined)
    const [agreePriceCollection] = useAgreePriceCollectionMutation()
    const handleAgreePriceCollection = async () => {
        if (currentCollection) {
            await agreePriceCollection({ _id: currentCollection?._id as string })
        }
    }

    const handlePayFeeExpert = useCallback(async () => {
        if (signer && provider && address && currentCollection) {
            try {
                const receipt = await payFeeExpert({ provider, signer, address, collection: currentCollection })
                console.log(receipt)
            } catch (error) {
                console.log(error)
            }
        }
    }, [signer, provider, address, currentCollection])

    const handlePayFeeCollection = useCallback(async () => {
        if (signer && provider && address && currentCollection) {
            try {
                const receipt = await payFeeCollection({ provider, signer, address, collection: currentCollection })
                console.log(receipt)
            } catch (error) {
                console.log(error)
            }
        }
    }, [signer, provider, address, currentCollection])

    return (
        <Card className='select-none w-full rounded-2xl shadow-md border-[1px] space-y-3 p-[2.5vw] '>
            <CardTitle className='text-2xl font-semibold'>My Collections Pending</CardTitle>
            <div className='flex flex-row justify-between items-center text-md font-semibold opacity-70 px-3 h-[3vw]'>
                <p className='w-[30%]'>{options[0]}</p>
                <p className='flex flex-row justify-end w-[10%]'>{options[1]}</p>
                <p className='flex flex-row justify-end w-[10%]'>{options[2]}</p>
                <p className='flex flex-row justify-end w-[10%]'>{options[3]}</p>
                <p className='flex flex-row justify-end w-[10%]'>{options[4]}</p>
                <p className='flex flex-row justify-end w-[10%]'>{options[5]}</p>
                <p className='flex flex-row justify-end w-[20%]'>{options[6]}</p>
            </div>
            <div className='flex flex-col border-t-[1px] w-full'>
                {collections.length > 0 && collections.map((item, index) => {
                    return (
                        <div key={index} className='cursor-pointer hover:bg-secondary/80 rounded-none flex flex-row items-center px-3 h-[4vw]'>
                            <Link href={`/nfts/personal/${item.name.toLowerCase().replace(/\s+/g, '')}`} className='hover:underline w-[80%] flex flex-row items-center'>
                                <div className='flex flex-row items-center space-x-[0.6vw] w-[37.5%] text-md'>
                                    <p>{index + 1}</p>
                                    <Avatar className="ml-[0.5vw] border-black">
                                        <AvatarImage src={item.logo || '/image/default-nft.png'} />
                                        <AvatarFallback>{item.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <p className='font-semibold oopacity-85'>{item.name}</p>
                                    <div className='flex flex-row bg-white/80 dark:bg-transparent  items-center space-x-2 border-[0.5px] rounded-xl text-xs py-1 px-2 shadow-sm border-blue-500 text-blue-500 '>
                                        <TagIcon className='w-[1vw] h-[1vw] ' />
                                        <p>{item?.category}</p>
                                    </div>
                                </div>
                                <div className='flex flex-row justify-end items-center w-[12.5%]'>{formatNumber(parseFloat(item.total_items))}</div>
                                <div className='flex flex-row justify-end items-center w-[12.5%]'>{item.total_fee}</div>
                                <div className='flex flex-row justify-end items-center w-[12.5%]'>{item.admin_status}</div>
                                <div className='flex flex-row justify-end items-center w-[12.5%]'>{item.user_status}</div>
                                <div className="w-[12.5%] flex flex-row justify-end items-center space-x-2">{item.status}</div>
                            </Link>
                            <div className="w-[20%] flex flex-row justify-end items-center space-x-1">
                                {
                                    item.admin_status === 'Accepted' && item.user_status === 'Agreed' && (item.status === 'AI Price' || item.status === 'Expert Price') &&
                                    <AlertDialog >
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" onClick={() => setCurrentCollection(item)}>Pay Fee</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                            <AlertDialogHeader className="flex flex-row justify-center w-full">
                                                <AlertDialogTitle className="text-xl">Pay Fee Expert for Collection</AlertDialogTitle>
                                                <VisuallyHidden>
                                                    <AlertDialogDescription>Form Pool Admin</AlertDialogDescription>
                                                </VisuallyHidden>
                                            </AlertDialogHeader>
                                            <div className="flex flex-col justify-center items-center w-full space-y-[1vw]">
                                                <Image src={currentCollection?.logo || "/image/default-image.png"} alt='logo.png' priority={true} width={20} height={20} className='w-[4vw] h-[4vw] border-[1px] rounded-2xl object-cover' />
                                                <p className='font-semibold'>{currentCollection?.name}</p>
                                                <div className='flex flex-row justify-between items-center w-full'>
                                                    <p>Maket fee: </p>
                                                    <div className='flex flex-row space-x-1'>
                                                        <p>{currentCollection?.fee_market}</p>
                                                        <p className='font-semibold'>{currentCollection?.currency}</p>
                                                    </div>
                                                </div>
                                                <div className='flex flex-row justify-between items-center w-full'>
                                                    <p>Mint fee: </p>
                                                    <div className='flex flex-row space-x-1'>
                                                        <p>{currentCollection?.fee_mint}</p>
                                                        <p className='font-semibold'>{currentCollection?.currency}</p>
                                                    </div>
                                                </div>
                                                <div className='flex flex-row justify-between items-center w-full'>
                                                    <p>Total fee: </p>
                                                    <div className='flex flex-row space-x-1'>
                                                        <p>{currentCollection?.total_fee}</p>
                                                        <p className='font-semibold'>{currentCollection?.currency}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel >Close</AlertDialogCancel>
                                                <AlertDialogAction onClick={handlePayFeeCollection} >Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                }
                                {
                                    item.user_status === 'Pending' && item.status === 'AI Price' &&
                                    <AlertDialog >
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" onClick={() => setCurrentCollection(item)}>Pay Fee Expert</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                            <AlertDialogHeader className="flex flex-row justify-center w-full">
                                                <AlertDialogTitle className="text-xl">Pay Fee Expert for Collection</AlertDialogTitle>
                                                <VisuallyHidden>
                                                    <AlertDialogDescription>Form Payment Admin</AlertDialogDescription>
                                                </VisuallyHidden>
                                            </AlertDialogHeader>
                                            <div className="flex flex-col justify-center items-center w-full space-y-[1vw]">
                                                <Image src={currentCollection?.logo || "/image/default-image.png"} alt='logo.png' priority={true} width={20} height={20} className='w-[4vw] h-[4vw] border-[1px] rounded-2xl object-cover' />
                                                <p className='font-semibold'>{currentCollection?.name}</p>
                                                <div className='flex flex-row justify-between items-center w-full'>
                                                    <p>Expert fee: </p>
                                                    <div className='flex flex-row space-x-1'>
                                                        <p>{currentCollection?.fee_expert}</p>
                                                        <p className='font-semibold'>{currentCollection?.currency}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel >Close</AlertDialogCancel>
                                                <AlertDialogAction onClick={handlePayFeeExpert} >Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                }
                                {
                                    (item.status === 'AI Price' || item.status === 'Expert Price') && item.user_status !== 'Agreed' && item.user_status !== 'Payed Fee' &&
                                    <AlertDialog >
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" onClick={() => setCurrentCollection(item)}>Agree</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                            <AlertDialogHeader className="flex flex-row justify-center w-full">
                                                <AlertDialogTitle className="text-xl">Agree Price of Collection</AlertDialogTitle>
                                                <VisuallyHidden>
                                                    <AlertDialogDescription>Form Payment Admin</AlertDialogDescription>
                                                </VisuallyHidden>
                                            </AlertDialogHeader>
                                            <div className="flex flex-col justify-center items-center w-full space-y-[1vw]">
                                                <Image src={currentCollection?.logo || "/image/default-image.png"} alt='logo.png' priority={true} width={20} height={20} className='w-[4vw] h-[4vw] border-[1px] rounded-2xl object-cover' />
                                                <p className='font-semibold'>{currentCollection?.name}</p>
                                            </div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel >Close</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleAgreePriceCollection} >Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card >
    )
}