'use client'
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setCurrentPendingCollection } from "@/redux/features/collection/collectionSlice";
import { GlobeIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { formatNumber } from '@/utils/formatNumber'
import { PendingCollection } from "@/lib/type";
import { useGetAcceptPendingCollectionsQuery, useGetRejectPendingCollectionsQuery, useGetWaitingPendingCollectionsQuery } from "@/redux/features/admin/adminSlice";
import { TagIcon } from "@heroicons/react/20/solid";

const twitterUrl = 'https://x.com/'
const optionsInfo = [
    "Items",
    "Registed",
    "Chain",
    "Owner",
    "Category",
    "Pay expert",
    "Pay fee",
    "Total Fees",
    "Admin status",
    "User status",
    "Status",
]

export default function CollectionLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    const dispatch = useDispatch()
    const { collection } = useParams()
    const { data: acceptedCollections } = useGetAcceptPendingCollectionsQuery()
    const { data: rejectedCollections } = useGetRejectPendingCollectionsQuery()
    const { data: waittingCollections } = useGetWaitingPendingCollectionsQuery()
    const [newCollection, setNewCollection] = useState<PendingCollection | undefined>(undefined)

    useEffect(() => {
        if (acceptedCollections && rejectedCollections && waittingCollections) {
            const newCollections = [...acceptedCollections, ...rejectedCollections, ...waittingCollections]
            const currentPendingCollection = newCollections?.find(item => item.name.toLowerCase().replace(/\s+/g, '') === collection)
            if (currentPendingCollection) {
                dispatch(setCurrentPendingCollection(currentPendingCollection))
                setNewCollection(currentPendingCollection)
            }
        } else {
            dispatch(setCurrentPendingCollection(undefined))
            setNewCollection(undefined)
        }
    }, [acceptedCollections, rejectedCollections, waittingCollections, collection, dispatch])

    return (
        <div className="flex flex-col min-h-[100vh]">
            <div className="relative select-none flex flex-col">
                <Image src={newCollection?.banner || '/image/default-image.png'} alt={newCollection?.name || ''} priority={true} width={200} height={200} className="w-full max-h-[50vh] layout:responsive object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute inset-0 flex flex-row mx-[2vw] my-[2vw] text-white">
                    <div className="flex flex-col justify-end w-[45%] space-y-[1vw]">
                        <Image src={newCollection?.logo || "/image/default-image.png"} priority={true} alt={newCollection?.name || ""} width={20} height={20} className="w-[6vw] h-[6vw] border-[1px] rounded-2xl border-white/70" />
                        <div className="flex flex-row justify-start divide-x-[1px] dark:divide-white items-center space-x-[1.5vw]">
                            <div className="flex flex-row justify-start items-center space-x-[1vw]">
                                <div className="text-2xl font-semibold">{newCollection?.name}</div>
                            </div>
                            <div className="flex flex-row justify-start items-center px-[1.5vw] space-x-[1vw]">
                                {newCollection?.project_url &&
                                    <a href={newCollection.project_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 hover:shadow-xl hover:shadow-blue-200/50 hover:opacity-70" >
                                        <GlobeIcon className="cursor-pointer w-[1.5vw] h-[1.5vw]" />
                                    </a>
                                }
                                {newCollection?.twitter_username &&
                                    <a href={`${twitterUrl}${newCollection.twitter_username}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 hover:shadow-xl hover:shadow-blue-200/50 hover:opacity-70" >
                                        <TwitterLogoIcon className="cursor-pointer w-[1.5vw] h-[1.5vw]" />
                                    </a>
                                }
                                <div className="flex flex-row space-x-[0.3vw]">
                                    <div>{optionsInfo[3]}</div>
                                    <div className="font-semibold">{newCollection?.owner.slice(0, 8)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-start items-center space-x-[1vw] text-sm">
                            <div className="flex flex-row space-x-[0.3vw]">
                                <div>{optionsInfo[0]}</div>
                                <div className="font-semibold">{formatNumber(parseFloat(newCollection?.total_items || ''))}</div>
                            </div>
                            <div className="w-[3px] h-[3px] bg-white rounded-full opacity-80 "></div>
                            <div className="flex flex-row space-x-[0.3vw]">
                                <div>{optionsInfo[1]}</div>
                                <div className="font-semibold">{(new Date(newCollection?.createdAt || '')).toLocaleString('en-US', { year: 'numeric', month: 'short' })}</div>
                            </div>
                            <div className="w-[3px] h-[3px] bg-white rounded-full opacity-80"></div>
                            <div className="flex flex-row space-x-[0.3vw]">
                                <div>{optionsInfo[2]}</div>
                                <div className="font-semibold">Ethereum</div>
                            </div>
                            <div className="w-[3px] h-[3px] bg-white rounded-full opacity-80"></div>
                            <div className="flex flex-row space-x-[0.5vw]">
                                <div>{optionsInfo[4]}</div>
                                <div className='flex flex-row dark:bg-white/15 items-center space-x-2 border-[0.1px] border-red-100 dark:border-blue-500 rounded-xl text-xs py-1 px-2 shadow-md text-blue-500'>
                                    <TagIcon className='w-[0.8vw] h-[0.8vw] ' />
                                    <p>{newCollection?.category}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-end items-end w-[55%] space-x-[2vw] text-sm">
                        {
                            newCollection?.payment_expert &&
                            <div className="flex flex-col">
                                <div className="flex flex-row justify-start items-center space-x-[0.3vw] font-semibold">
                                    <p>{newCollection?.payment_expert}</p>
                                    <p>{newCollection?.currency}</p>
                                </div>
                                <div>{optionsInfo[5]}</div>
                            </div>
                        }
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-start items-center space-x-[0.3vw] font-semibold">
                                <p>{newCollection?.payment_fee}</p>
                                <p>{newCollection?.currency}</p>
                            </div>
                            <div>{optionsInfo[6]}</div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-start items-center space-x-[0.3vw] font-semibold">
                                <p>{newCollection?.total_fee}</p>
                                <p>{newCollection?.currency}</p>
                            </div>
                            <div>{optionsInfo[7]}</div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-start items-center space-x-[0.3vw] font-semibold">
                                <p>{newCollection?.admin_status}</p>
                            </div>
                            <div>{optionsInfo[8]}</div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-start items-center space-x-[0.3vw] font-semibold">
                                <p>{newCollection?.user_status}</p>
                            </div>
                            <div>{optionsInfo[9]}</div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-start items-center space-x-[0.3vw] font-semibold">
                                <p>{newCollection?.status}</p>
                            </div>
                            <div>{optionsInfo[10]}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col mx-[5vw] my-[2vw]">
                {children}
            </div>
        </div>
    )
}