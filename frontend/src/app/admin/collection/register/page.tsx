'use client'
import { Card, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import useAuthCheck from "@/hooks/useAuthCheck"
import { formatNumber } from '@/utils/formatNumber'
import { Button } from "@/components/ui/button"
import { useAcceptPendingCollectionMutation, useGetAcceptPendingCollectionsQuery, useGetRejectPendingCollectionsQuery, useGetWaitingPendingCollectionsQuery, useRejectPendingCollectionMutation, useWaittingPendingCollectionMutation } from '@/redux/features/admin/adminSlice'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components//ui/tabs'
import { CommitIcon } from '@radix-ui/react-icons'
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useEffect } from 'react'
import { useToast } from '@/hooks/useToast'
import Image from 'next/image'

const options = ['Colleciton name', 'Owner', 'Create At', 'Items', 'Status']
export default function CollectionAdmin() {
    useAuthCheck()
    const { showSuccess, showError } = useToast()
    const { data: acceptedCollections } = useGetAcceptPendingCollectionsQuery()
    const { data: rejectedCollections } = useGetRejectPendingCollectionsQuery()
    const { data: waittingCollections } = useGetWaitingPendingCollectionsQuery()
    const [rejectPendingCollection, { isSuccess: isSuccessRejectCollection, isError: isErrorRejectCollection }] = useRejectPendingCollectionMutation()
    const [acceptPendingCollection, { isSuccess: isSuccessAcceptCollection, isError: isErrorAcceptCollection }] = useAcceptPendingCollectionMutation()
    const [waittingPendingCollection, { isSuccess: isSuccessWaittingCollection, isError: isErrorWaittingCollection }] = useWaittingPendingCollectionMutation()

    useEffect(() => {
        if (isSuccessWaittingCollection) {
            showSuccess("Collection Waitting Is Success!")
        }
        if (isErrorWaittingCollection) {
            showError("Collection Waitting Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessWaittingCollection, isErrorWaittingCollection])

    useEffect(() => {
        if (isSuccessRejectCollection) {
            showSuccess("Collection Reject Is Success!")
        }
        if (isErrorRejectCollection) {
            showError("Collection Reject Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessRejectCollection, isErrorRejectCollection])

    useEffect(() => {
        if (isSuccessAcceptCollection) {
            showSuccess("Collection Accept Is Success!")
        }
        if (isErrorAcceptCollection) {
            showError("Collection Accept Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessAcceptCollection, isErrorAcceptCollection])

    const handleRejectCollection = async (_id: string) => {
        await rejectPendingCollection({ _id })
    }

    const handleAcceptCollection = async (_id: string) => {
        await acceptPendingCollection({ _id })
    }

    const handleMintCollection = async (_id: string) => {
        console.log(_id)
    }

    const handlePendingCollection = async (_id: string) => {
        await waittingPendingCollection({ _id })
    }


    return (
        <div className="select-none flex flex-col justify-center items-center w-full  py-[2vw] space-y-[2vw]">
            <div className="w-full px-[4vw]">
                <Tabs defaultValue="accept" className="flex flex-col justify-center">
                    <TabsList className="flex flex-rol select-none justify-center items-center mx-[35%]">
                        <TabsTrigger value="accept" className="w-[50%] h-full">Accept</TabsTrigger>
                        <TabsTrigger value="pending" className="w-[50%] h-full">Pending</TabsTrigger>
                        <TabsTrigger value="reject" className="w-[50%] h-full">Reject</TabsTrigger>
                    </TabsList>
                    <TabsContent value="accept" className="w-full">
                        <Card className="flex flex-col w-full rounded-2xl border-[1px] space-y-3 p-[2.5vw] shadow-md max-h-[76vh] overflow-y-auto">
                            <CardTitle className='text-2xl font-semibold'>NFT Collections Accepted</CardTitle>
                            <div className='flex flex-row justify-between items-center text-md font-semibold opacity-70 px-3 h-[3vw]'>
                                <p className='w-[30%]'>{options[0]}</p>
                                <p className='flex flex-row justify-end w-[15%]'>{options[1]}</p>
                                <p className='flex flex-row justify-end w-[15%]'>{options[2]}</p>
                                <p className='flex flex-row justify-end w-[10%]'>{options[3]}</p>
                                <p className='flex flex-row justify-end w-[15%]'>{options[4]}</p>
                                <div className='flex flex-row justify-end w-[15%]'></div>
                            </div>
                            <div className='flex flex-col border-t-[1px] w-full'>
                                {acceptedCollections && acceptedCollections.length > 0 && acceptedCollections.map((item, index) => {
                                    return (
                                        <div key={index} className='cursor-pointer hover:bg-secondary/80 rounded-none flex flex-row items-center px-3 h-[4vw]'>
                                            <div className='flex flex-row justify-start items-center space-x-[0.6vw] w-[30%] text-md hover:underline'>
                                                <Link href={`/admin/collection/register/${item.name.toLowerCase().replace(/\s+/g, '')}`} className='flex flex-row justify-start items-center space-x-1'>
                                                    <p>{index + 1}</p>
                                                    <Avatar className="ml-[0.5vw] border-black">
                                                        <AvatarImage src={item.logo || '/image/default-nft.png'} />
                                                        <AvatarFallback>{item.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <p className='font-semibold oopacity-85'>{item.name}</p>
                                                </Link>
                                            </div>
                                            <div className='flex flex-row justify-end w-[15%]'>{item.owner.slice(0, 8)}</div>
                                            <div className='flex flex-row justify-end w-[15%]'>{(new Date(item.createdAt || '')).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                            <div className='flex flex-row justify-end w-[10%]'>{formatNumber(parseFloat(item.total_items))}</div>
                                            <div className="w-[15%] flex flex-row justify-end items-center space-x-2">
                                                <CommitIcon className="w-[1vw] h-[1vw] stroke-green-600" />
                                                <p>{item.status}</p>
                                            </div>
                                            <div className="flex flex-row justify-end w-[15%] space-x-[0.5vw]">
                                                <AlertDialog >
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline">Mint</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                                        <AlertDialogHeader className="bg-fixed w-full">
                                                            <AlertDialogTitle>Minting Collection</AlertDialogTitle>
                                                        </AlertDialogHeader>
                                                        <div className="flex flex-col justify-center items-center w-full space-y-[1vw]">
                                                            <Image src={item.logo} alt='logo.png' priority={true} width={20} height={20} className='w-[4vw] h-[4vw] border-[1px] rounded-2xl object-cover' />
                                                            <p className='font-semibold'>{item.name}</p>
                                                        </div>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel >Close</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleMintCollection(item._id)} >Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                                <AlertDialog >
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline">Reject</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                                        <AlertDialogHeader className="bg-fixed w-full">
                                                            <AlertDialogTitle>Rejecting Collection</AlertDialogTitle>
                                                        </AlertDialogHeader>
                                                        <div className="flex flex-col justify-center items-center w-full space-y-[1vw]">
                                                            <Image src={item.logo} alt='logo.png' priority={true} width={20} height={20} className='w-[4vw] h-[4vw] border-[1px] rounded-2xl object-cover' />
                                                            <p className='font-semibold'>{item.name}</p>
                                                        </div>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel >Close</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleRejectCollection(item._id)} >Continue</AlertDialogAction>
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
                    <TabsContent value="pending" className="w-full">
                        <Card className="flex flex-col w-full rounded-2xl border-[1px] space-y-3 p-[2.5vw] shadow-md max-h-[76vh] overflow-y-auto">
                            <CardTitle className='text-2xl font-semibold'>NFT Collections Pending</CardTitle>
                            <div className='flex flex-row justify-between items-center text-md font-semibold opacity-70 px-3 h-[3vw]'>
                                <p className='w-[30%]'>{options[0]}</p>
                                <p className='flex flex-row justify-end w-[15%]'>{options[1]}</p>
                                <p className='flex flex-row justify-end w-[15%]'>{options[2]}</p>
                                <p className='flex flex-row justify-end w-[10%]'>{options[3]}</p>
                                <p className='flex flex-row justify-end w-[15%]'>{options[4]}</p>
                                <div className='flex flex-row justify-end w-[15%]'></div>
                            </div>
                            <div className='flex flex-col border-t-[1px] w-full'>
                                {waittingCollections && waittingCollections.length > 0 && waittingCollections.map((item, index) => {
                                    return (
                                        <div key={index} className='cursor-pointer hover:bg-secondary/80 rounded-none flex flex-row items-center px-3 h-[4vw]'>
                                            <div className='flex flex-row justify-start items-center space-x-[0.6vw] w-[30%] text-md hover:underline'>
                                                <Link href={`/admin/collection/register/${item.name.toLowerCase().replace(/\s+/g, '')}`} className='flex flex-row justify-start items-center space-x-1'>
                                                    <p>{index + 1}</p>
                                                    <Avatar className="ml-[0.5vw] border-black">
                                                        <AvatarImage src={item.logo || '/image/default-nft.png'} />
                                                        <AvatarFallback>{item.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <p className='font-semibold oopacity-85'>{item.name}</p>
                                                </Link>
                                            </div>
                                            <div className='flex flex-row justify-end w-[15%]'>{item.owner.slice(0, 8)}</div>
                                            <div className='flex flex-row justify-end w-[15%]'>{(new Date(item.createdAt || '')).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                            <div className='flex flex-row justify-end w-[10%]'>{formatNumber(parseFloat(item.total_items))}</div>
                                            <div className="w-[15%] flex flex-row justify-end items-center space-x-2">
                                                <CommitIcon className="w-[1vw] h-[1vw] stroke-yellow-600" />
                                                <p>pending</p>
                                            </div>
                                            <div className="flex flex-row justify-center w-[15%] space-x-[0.5vw]">
                                                <AlertDialog >
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline">Accept</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                                        <AlertDialogHeader className="bg-fixed w-full">
                                                            <AlertDialogTitle>Accepting Collection</AlertDialogTitle>
                                                        </AlertDialogHeader>
                                                        <div className="flex flex-col justify-center items-center w-full space-y-[1vw]">
                                                            <Image src={item.logo} alt='logo.png' priority={true} width={20} height={20} className='w-[4vw] h-[4vw] border-[1px] rounded-2xl object-cover' />
                                                            <p className='font-semibold'>{item.name}</p>
                                                        </div>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel >Close</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleAcceptCollection(item._id)} >Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                                <AlertDialog >
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline">Reject</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                                        <AlertDialogHeader className="bg-fixed w-full">
                                                            <AlertDialogTitle>Rejecting Collection</AlertDialogTitle>
                                                        </AlertDialogHeader>
                                                        <div className="flex flex-col justify-center items-center w-full space-y-[1vw]">
                                                            <Image src={item.logo} alt='logo.png' priority={true} width={20} height={20} className='w-[4vw] h-[4vw] border-[1px] rounded-2xl object-cover' />
                                                            <p className='font-semibold'>{item.name}</p>
                                                        </div>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel >Close</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleRejectCollection(item._id)} >Continue</AlertDialogAction>
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
                    <TabsContent value="reject" className="w-full">
                        <Card className="flex flex-col w-full rounded-2xl border-[1px] space-y-3 p-[2.5vw] shadow-md max-h-[76vh] overflow-y-auto">
                            <CardTitle className='text-2xl font-semibold'>NFT Collections Rejected</CardTitle>
                            <div className='flex flex-row justify-between items-center text-md font-semibold opacity-70 px-3 h-[3vw]'>
                                <p className='w-[30%]'>{options[0]}</p>
                                <p className='flex flex-row justify-end w-[15%]'>{options[1]}</p>
                                <p className='flex flex-row justify-end w-[15%]'>{options[2]}</p>
                                <p className='flex flex-row justify-end w-[10%]'>{options[3]}</p>
                                <p className='flex flex-row justify-end w-[15%]'>{options[4]}</p>
                                <div className='flex flex-row justify-end w-[15%]'></div>
                            </div>
                            <div className='flex flex-col border-t-[1px] w-full'>
                                {rejectedCollections && rejectedCollections.length > 0 && rejectedCollections.map((item, index) => {
                                    return (
                                        <div key={index} className='cursor-pointer hover:bg-secondary/80 rounded-none flex flex-row items-center px-3 h-[4vw]'>
                                            <div className='flex flex-row justify-start items-center space-x-[0.6vw] w-[30%] text-md hover:underline'>
                                                <Link href={`/admin/collection/register/${item.name.toLowerCase().replace(/\s+/g, '')}`} className='flex flex-row justify-start items-center space-x-1'>
                                                    <p>{index + 1}</p>
                                                    <Avatar className="ml-[0.5vw] border-black">
                                                        <AvatarImage src={item.logo || '/image/default-nft.png'} />
                                                        <AvatarFallback>{item.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <p className='font-semibold oopacity-85'>{item.name}</p>
                                                </Link>
                                            </div>
                                            <div className='flex flex-row justify-end w-[15%]'>{item.owner.slice(0, 8)}</div>
                                            <div className='flex flex-row justify-end w-[15%]'>{(new Date(item.createdAt || '')).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                            <div className='flex flex-row justify-end w-[10%]'>{formatNumber(parseFloat(item.total_items))}</div>
                                            <div className="w-[15%] flex flex-row justify-end items-center space-x-2">
                                                <CommitIcon className="w-[1vw] h-[1vw] stroke-red-600" />
                                                <p>reject</p>
                                            </div>
                                            <div className="flex flex-row justify-center w-[15%] space-x-[0.5vw]">
                                                <AlertDialog >
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline">Pending</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                                        <AlertDialogHeader className="bg-fixed w-full">
                                                            <AlertDialogTitle>Add Pending Collection</AlertDialogTitle>
                                                        </AlertDialogHeader>
                                                        <div className="flex flex-col justify-center items-center w-full space-y-[1vw]">
                                                            <Image src={item.logo} alt='logo.png' priority={true} width={20} height={20} className='w-[4vw] h-[4vw] border-[1px] rounded-2xl object-cover' />
                                                            <p className='font-semibold'>{item.name}</p>
                                                        </div>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel >Close</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handlePendingCollection(item._id)} >Continue</AlertDialogAction>
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