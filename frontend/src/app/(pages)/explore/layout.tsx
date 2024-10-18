'use client'
import { useState } from "react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import TVLChart from "@/components/chart/tvlChart";
import VolumeChart from "@/components/chart/volumeChart";
import { Button } from "@/components/ui/button";

const listOptions = [
    {
        name: 'Tokens',
        link: '/explore/tokens'
    },
    {
        name: 'Pools',
        link: '/explore/pools'
    },
    {
        name: 'Transactions',
        link: '/explore/transactions'
    },
]

export default function ExploreLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const [isActive, setIsActive] = useState<number>(0)
    const handleOptions = (index: number) => {
        setIsActive(index)
    }

    if (pathname.startsWith('/explore/tokens/') || pathname.startsWith('/explore/pools/')) {
        return <>{children}</>;
    }
    return (
        <div className="flex flex-col justify-start select-none w-full h-full px-[15vw] py-[4vw]">
            <div className=" flex flex-row items-start space-x-[1vw] w-full">
                <div className="w-[50%]">
                    <TVLChart />
                </div>
                <div className="w-[50%]">
                    <VolumeChart />
                </div>
            </div>
            <div className="flex flex-col w-full">
                <div className="flex flex-row space-x-[2vw]">
                    {listOptions.map((option, index) => {
                        return (
                            <Link key={index} href={option.link}>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleOptions(index)}
                                    key={index}
                                    className={`text-2xl font-semibold opacity-50 ${isActive === index && 'opacity-85'}`}
                                >{option.name}</Button>
                            </Link>
                        )
                    })}
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}