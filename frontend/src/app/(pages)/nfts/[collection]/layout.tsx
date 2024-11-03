'use client'
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useGetCollectionsQuery } from "@/redux/features/api/apiSlice";
import { setCurrentCollection } from "@/redux/features/collection/collectionSlice";

export default function CollectionLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    const dispatch = useDispatch()
    const { data: collections } = useGetCollectionsQuery()
    const [isActive, setIsActive] = useState<number>(0)
    const { collection } = useParams()

    useEffect(() => {
        if (collections?.length) {
            const currentCollection = collections?.find(item => item.name.toLowerCase().replace(/\s+/g, '') === collection)
            if (currentCollection) {
                dispatch(setCurrentCollection(currentCollection))
            }
        }
    }, [collections, collection, dispatch])

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
    return (
        <div className="flex flex-col min-h-[100vh] mx-[15vw] my-[5vw]">
            <div className="flex flex-row my-[1vw]">
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
            <div className="w-full">
                {children}
            </div>
        </div>
    )
}