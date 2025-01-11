'use client'
import { useParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useGetCollectionsQuery } from "@/redux/features/api/apiSlice";
import { setCurrentCollection } from "@/redux/features/collection/collectionSlice";
import { CheckBadgeIcon } from '@heroicons/react/20/solid'
import { GlobeIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { formatNumber } from '@/utils/formatNumber'
import { Collection } from "@/lib/type";
import { TagIcon } from "@heroicons/react/20/solid";

const twitterUrl = 'https://x.com/'
const optionsInfo = [
    "Items",
    "Created",
    "Chain",
    "Category",
    "Total volume",
    'Floor price',
    'Highest price',
    'Listed',
    'Owners (Unique)'
]

export default function CollectionLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    const dispatch = useDispatch()
    const { collection } = useParams()
    const pathname = usePathname()
    const [percentListed, setPercentListed] = useState<string>('')
    const { data: collections } = useGetCollectionsQuery()
    const [isActive, setIsActive] = useState<number | undefined>(undefined)
    const [newCollection, setNewCollection] = useState<Collection | undefined>(undefined)

    useEffect(() => {
        if (collections?.length) {
            const currentCollection = collections?.find(item => item.name.toLowerCase().replace(/\s+/g, '') === collection)
            if (currentCollection) {
                dispatch(setCurrentCollection(currentCollection))
                setNewCollection(currentCollection)
            }
        }
    }, [collections, collection, dispatch])

    useEffect(() => {
        if (newCollection) {
            const percent = (parseFloat(newCollection.total_listed) / parseFloat(newCollection.total_items) * 100 || 0).toFixed(2);
            setPercentListed(percent.endsWith('.00') ? parseInt(percent, 10).toString() : percent);
        }
    }, [newCollection])

    const options = [
        {
            name: 'Items',
            link: `/nfts/${collection}`
        },
        {
            name: 'Listed',
            link: `/nfts/${collection}/listed`
        },
        {
            name: "My NFT",
            link: `/nfts/${collection}/mynft`
        },
    ]

    useEffect(() => {
        options.map((item, index) => {
            if (item.link === pathname) {
                setIsActive(index)
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])

    if (![options[0].link, options[1].link, options[2].link].includes(pathname)) {
        return <>{children}</>
    }

    return (
        <div className="flex flex-col min-h-[100vh]">
            <div className="relative select-none flex flex-col">
                <Image src={newCollection?.banner || '/image/default-image.png'} priority={true} alt={newCollection?.name || ''} width={200} height={200} className="w-full max-h-[50vh] layout:responsive object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute inset-0 flex flex-row mx-[5vw] my-[2vw] text-white">
                    <div className="flex flex-col justify-end w-[50%] space-y-[1vw]">
                        <Image src={newCollection?.logo || "/image/default-image.png"} priority={true} alt={newCollection?.name || ""} width={20} height={20} className="w-[6vw] h-[6vw] border-[1px] rounded-2xl border-white/70" />
                        <div className="flex flex-row justify-start divide-x-[1px] dark:divide-white items-center space-x-[1.5vw]">
                            <div className="flex flex-row justify-start items-center space-x-[1vw]">
                                <div className="text-2xl font-semibold">{newCollection?.name}</div>
                                {newCollection?.verified &&
                                    <div className="relative bg-white rounded-full w-[1vw] h-[1vw]">
                                        <CheckBadgeIcon className="absolute top-1/2 left-1/2 w-[1.5vw] h-[1.5vw] transform -translate-x-1/2 -translate-y-1/2 m-0 text-blue-500" />
                                    </div>
                                }
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
                            </div>
                        </div>
                        <div className="flex flex-row justify-start items-center space-x-[1vw] text-md">
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
                            <div className="flex flex-row space-x-[0.8vw]">
                                <div>{optionsInfo[3]}</div>
                                <div className='flex flex-row bg-white/80  items-center space-x-2 border-[0.5px] rounded-xl text-xs py-1 px-2 shadow-sm border-blue-500 text-blue-500 '>
                                    <TagIcon className='w-[1vw] h-[1vw] ' />
                                    <p>{newCollection?.category}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-end items-end w-[50%] space-x-[2vw]">
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-start items-center space-x-[0.3vw] text-lg font-semibold">
                                <div>{newCollection?.volume.slice(0, newCollection.volume.indexOf('.') + 4)}</div>
                                <div>{newCollection?.currency ? newCollection.currency.toUpperCase() : ""}</div>
                            </div>
                            <div>{optionsInfo[4]}</div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-start items-center space-x-[0.3vw] text-lg font-semibold">
                                <div>{newCollection?.floor_price.slice(0, newCollection.floor_price.indexOf('.') + 4)}</div>
                                <div>{newCollection?.currency ? newCollection.currency.toUpperCase() : ""}</div>
                            </div>
                            <div>{optionsInfo[5]}</div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-start items-center space-x-[0.3vw] text-lg font-semibold">
                                <div>{newCollection?.highest_price.slice(0, newCollection.highest_price.indexOf('.') + 4)}</div>
                                <div>{newCollection?.currency ? newCollection.currency.toUpperCase() : ""}</div>
                            </div>
                            <div>{optionsInfo[6]}</div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-start items-center text-lg font-semibold">
                                <div>{percentListed}</div>
                                <div>%</div>
                            </div>
                            <div>{optionsInfo[7]}</div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-start items-center space-x-[0.3vw] text-lg font-semibold">
                                <div>{newCollection?.total_owners}</div>
                            </div>
                            <div>{optionsInfo[8]}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col mx-[15vw]">
                <div className="select-none flex flex-row my-[1vw]">
                    {options.map((option, index) => {
                        return (
                            <Button
                                onClick={() => setIsActive(index)}
                                key={index} variant="link"
                                className={`text-md font-medium ${isActive === index && 'underline'}`}
                                asChild
                            >
                                <Link href={option.link}>
                                    {option.name}
                                </Link>
                            </Button>
                        )
                    })}
                </div>
                <div className="w-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}