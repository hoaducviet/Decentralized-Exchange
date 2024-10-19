'use client'
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CollectionLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    const [isActive, setIsActive] = useState<number>(0)
    const { collection } = useParams()
    const options = [
        {
            name: 'Items',
            link: `/nfts/${collection}`
        },
        {
            name: 'Listed',
            link: `/nfts/${collection}/listed`
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