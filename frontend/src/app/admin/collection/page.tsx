'use client'
import { useGetCollectionsQuery } from '@/redux/features/api/apiSlice'
import { Card, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import useAuthCheck from "@/hooks/useAuthCheck"
import { ArrowPathIcon, CheckBadgeIcon, TagIcon } from '@heroicons/react/20/solid'
import { formatNumber } from '@/utils/formatNumber'
import { Button } from "@/components/ui/button"
import { useActiveCollectionMutation, useDeleteCollectionMutation, useGetSuspendedCollectionsQuery, useUpdateCollectionsMutation, useUpdateNFTsMutation } from '@/redux/features/admin/adminSlice'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components//ui/tabs'
import { CommitIcon } from '@radix-ui/react-icons'
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { useEffect } from 'react'
import { useToast } from '@/hooks/useToast'
import Image from 'next/image'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

const options = ['Colleciton name', 'Volume (ETH)', 'Floor (ETH)', 'Items', 'Status']
const list = ['Total', 'Update Collections', 'Update NFTs']

export default function CollectionAdmin() {
    useAuthCheck()
    const { showSuccess, showError } = useToast()
    const { data: collections } = useGetCollectionsQuery()
    const { data: suspendedCollections } = useGetSuspendedCollectionsQuery()
    const [updateCollections, { isSuccess: isSuccessUpdateCollections, isError: isErrorUpdateCollections }] = useUpdateCollectionsMutation()
    const [deleteCollection, { isSuccess: isSuccessDeleteCollection, isError: isErrorDeleteCollection }] = useDeleteCollectionMutation()
    const [activeCollection, { isSuccess: isSuccessActiveCollection, isError: isErrorActiveCollection }] = useActiveCollectionMutation()
    const [updateNFTs, { isSuccess: isSuccessUpdateNFTs, isError: isErrorUpdateNFTs }] = useUpdateNFTsMutation()

    useEffect(() => {
        if (isSuccessUpdateNFTs) {
            showSuccess("Update NFTs Is Success!")
        }
        if (isErrorUpdateNFTs) {
            showError("Update NFTs Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessUpdateNFTs, isErrorUpdateNFTs])

    useEffect(() => {
        if (isSuccessDeleteCollection) {
            showSuccess("Collection Delete Is Success!")
        }
        if (isErrorDeleteCollection) {
            showError("Collection Delete Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessDeleteCollection, isErrorDeleteCollection])

    useEffect(() => {
        if (isSuccessActiveCollection) {
            showSuccess("Collection Active Is Success!")
        }
        if (isErrorActiveCollection) {
            showError("Collection Active Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessActiveCollection, isErrorActiveCollection])

    useEffect(() => {
        if (isSuccessUpdateCollections) {
            showSuccess("Collection Tokens Is Success!")
        }
        if (isErrorUpdateCollections) {
            showError("Collection Tokens Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessUpdateCollections, isErrorUpdateCollections])

    const handleDeleteCollection = async (_id: string) => {
        await deleteCollection({ _id })
    }

    const handleActiveCollection = async (_id: string) => {
        await activeCollection({ _id })
    }
    return (
        <div className="select-none flex flex-col justify-center items-center w-full  py-[2vw] space-y-[2vw]">
            <div className="flex flex-row w-full justify-between items-center pr-[4vw] text-white">
                <div className="flex flex-col justify-center items-start bg-blue-500 dark:bg-white/10 dark:border-white/40 border-y-[0.1px] border-r-[0.1px] w-[12vw] h-[3.5vw] pl-[1vw] rounded-r-full">
                    <p className="text-xl font-semibold">{list[0]}</p>
                    <p >{`${collections ? collections?.length : 0} Collections Active`}</p>
                </div>
                <div className="flex flex-row justify-end items-center space-x-[1vw]">
                    <div onClick={() => updateNFTs()} className="cursor-pointer dark:bg-white/10 bg-blue-500 dark:border-white/40 hover:dark:border-blue-500 border-[0.1px] flex flex-row justify-end items-center rounded-2xl shadow-2xl space-x-2 h-[3vw] px-[1vw]">
                        <ArrowPathIcon className="w-[1.5vw] h-[1.5vw]" />
                        <p className="font-semibold ">{list[2]}</p>
                    </div>
                    <div onClick={() => updateCollections()} className="cursor-pointer dark:bg-white/10 bg-blue-500 dark:border-white/40 hover:dark:border-blue-500 border-[0.1px] flex flex-row justify-end items-center rounded-2xl shadow-2xl space-x-2 h-[3vw] px-[1vw]">
                        <ArrowPathIcon className="w-[1.5vw] h-[1.5vw]" />
                        <p className="font-semibold ">{list[1]}</p>
                    </div>
                </div>
            </div>
            <div className="w-full px-[4vw]">
                <Tabs defaultValue="active" className="flex flex-col justify-center">
                    <TabsList className="flex flex-rol select-none justify-center items-center mx-[40%]">
                        <TabsTrigger value="active" className="w-[50%] h-full">Active</TabsTrigger>
                        <TabsTrigger value="suspended" className="w-[50%] h-full">Suspended</TabsTrigger>
                    </TabsList>
                    <TabsContent value="active" className="w-full">
                        <Card className="flex flex-col w-full rounded-2xl border-[1px] space-y-3 p-[2.5vw] shadow-md max-h-[76vh] overflow-y-auto">
                            <CardTitle className='text-2xl font-semibold'>NFT Collections</CardTitle>
                            <div className='flex flex-row justify-between items-center text-md font-semibold opacity-70 px-3 h-[3vw]'>
                                <p className='w-[35%]'>{options[0]}</p>
                                <p className='flex flex-row justify-end w-[15%]'>{options[1]}</p>
                                <p className='flex flex-row justify-end w-[15%]'>{options[2]}</p>
                                <p className='flex flex-row justify-end w-[10%]'>{options[3]}</p>
                                <p className='flex flex-row justify-end w-[10%]'>{options[4]}</p>
                                <div className='flex flex-row justify-end w-[15%]'></div>
                            </div>
                            <div className='flex flex-col border-t-[1px] w-full'>
                                {collections && collections.length > 0 && collections.map((item, index) => {
                                    return (
                                        <div key={index} className='cursor-pointer hover:bg-secondary/80 rounded-none flex flex-row items-center px-3 h-[4vw]'>
                                            <div className='flex flex-row justify-start items-center space-x-[0.6vw] w-[35%] text-md hover:underline'>
                                                <Link href={`/admin/collection/nfts/${item.name.toLowerCase().replace(/\s+/g, '')}`} className='flex flex-row justify-start items-center space-x-1'>
                                                    <p>{index + 1}</p>
                                                    <Avatar className="ml-[0.5vw] border-black">
                                                        <AvatarImage src={item.logo || '/image/default-nft.png'} />
                                                        <AvatarFallback>{item.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <p className='font-semibold oopacity-85'>{item.name}</p>
                                                    {item.verified && <CheckBadgeIcon className="w-5 h-5 text-blue-500 " />}
                                                    <div className='flex flex-row dark:bg-white/15 items-center space-x-2 border-[0.1px] border-red-100 dark:border-blue-500 rounded-xl text-xs py-1 px-2 shadow-md text-blue-500'>
                                                        <TagIcon className='w-[0.8vw] h-[0.8vw] ' />
                                                        <p>{item.category}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className='flex flex-row justify-end w-[15%]'>{formatNumber(parseFloat(item.volume.slice(0, item.volume.indexOf('.') + 4)))}</div>
                                            <div className='flex flex-row justify-end w-[15%]'>{item.floor_price.slice(0, item.floor_price.indexOf('.') + 4)}</div>
                                            <div className='flex flex-row justify-end w-[10%]'>{formatNumber(parseFloat(item.total_items))}</div>
                                            <div className="w-[10%] flex flex-row justify-end items-center space-x-2">
                                                <CommitIcon className="w-[1vw] h-[1vw] stroke-green-600" />
                                                <p>active</p>
                                            </div>
                                            <div className="flex flex-row justify-end w-[15%] space-x-[0.5vw]">
                                                <AlertDialog >
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline">Suspended</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                                        <AlertDialogHeader className="bg-fixed w-full">
                                                            <AlertDialogTitle>Suspended Collection</AlertDialogTitle>
                                                            <VisuallyHidden>
                                                                <AlertDialogDescription>Form Collection Admin</AlertDialogDescription>
                                                            </VisuallyHidden>
                                                        </AlertDialogHeader>
                                                        <div className="flex flex-col justify-center items-center w-full space-y-[1vw]">
                                                            <Image src={item.logo} alt='logo.png' priority={true} width={20} height={20} className='w-[4vw] h-[4vw] border-[1px] rounded-2xl object-cover' />
                                                            <p className='font-semibold'>{item.name}</p>
                                                        </div>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel >Close</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteCollection(item._id)} >Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Card>
                    </TabsContent>
                    <TabsContent value="suspended" className="w-full">
                        <Card className="flex flex-col w-full rounded-2xl border-[1px] space-y-3 p-[2.5vw] shadow-md max-h-[76vh] overflow-y-auto">
                            <CardTitle className='text-2xl font-semibold'>NFT Collections Suspended</CardTitle>
                            <div className='flex flex-row justify-between items-center text-md font-semibold opacity-70 px-3 h-[3vw]'>
                                <p className='w-[35%]'>{options[0]}</p>
                                <p className='flex flex-row justify-end w-[15%]'>{options[2]}</p>
                                <p className='flex flex-row justify-end w-[15%]'>{options[3]}</p>
                                <p className='flex flex-row justify-end w-[15%]'>{options[4]}</p>
                                <div className='flex flex-row justify-end w-[20%]'></div>
                            </div>
                            <div className='flex flex-col border-t-[1px] w-full'>
                                {suspendedCollections && suspendedCollections.length > 0 && suspendedCollections.map((item, index) => {
                                    return (
                                        <div key={index} className='cursor-pointer hover:bg-secondary/80 rounded-none flex flex-row items-center px-3 h-[4vw]'>
                                            <div className='flex flex-row justify-start items-center space-x-[0.6vw] w-[35%] text-md hover:underline'>
                                                <Link href={`/admin/collection/nfts/${item.name.toLowerCase().replace(/\s+/g, '')}`} className='flex flex-row justify-start items-center space-x-1'>
                                                    <p>{index + 1}</p>
                                                    <Avatar className="ml-[0.5vw] border-black">
                                                        <AvatarImage src={item.logo || '/image/default-nft.png'} />
                                                        <AvatarFallback>{item.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <p className='font-semibold oopacity-85'>{item.name}</p>
                                                    {item.verified && <CheckBadgeIcon className="w-5 h-5 text-blue-500 " />}
                                                    <div className='flex flex-row dark:bg-white/15 items-center space-x-2 border-[0.1px] border-red-100 dark:border-blue-500 rounded-xl text-xs py-1 px-2 shadow-md text-blue-500'>
                                                        <TagIcon className='w-[0.8vw] h-[0.8vw] ' />
                                                        <p>{item.category}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className='flex flex-row justify-end w-[15%]'>{item.floor_price.slice(0, item.floor_price.indexOf('.') + 4)}</div>
                                            <div className='flex flex-row justify-end w-[15%]'>{formatNumber(parseFloat(item.total_items))}</div>
                                            <div className="w-[15%] flex flex-row justify-end items-center space-x-2">
                                                <CommitIcon className="w-[1vw] h-[1vw] stroke-red-600" />
                                                <p>suspended</p>
                                            </div>
                                            <div className="flex flex-row justify-center w-[20%] space-x-[0.5vw]">
                                                <AlertDialog >
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline">Active</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                                        <AlertDialogHeader className="bg-fixed w-full">
                                                            <AlertDialogTitle>Active Collection</AlertDialogTitle>
                                                            <VisuallyHidden>
                                                                <AlertDialogDescription>Form Collection Admin</AlertDialogDescription>
                                                            </VisuallyHidden>
                                                        </AlertDialogHeader>
                                                        <div className="flex flex-col justify-center items-center w-full space-y-[1vw]">
                                                            <Image src={item.logo} alt='logo.png' priority={true} width={20} height={20} className='w-[4vw] h-[4vw] border-[1px] rounded-2xl object-cover' />
                                                            <p className='font-semibold'>{item.name}</p>
                                                        </div>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel >Close</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleActiveCollection(item._id)} >Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>

    )
}