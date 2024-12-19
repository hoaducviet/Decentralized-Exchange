'use client'
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { useGetDailyTVLQuery, useGetDailyVolumeQuery } from '@/redux/features/api/apiSlice'
import TVLChart from "@/components/chart/TvlChart";
import VolumeChart from "@/components/chart/VolumeChart";
import { Button } from "@/components/ui/button";

const options = [
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
    const [isActive, setIsActive] = useState<number | undefined>(undefined)
    const { data: volumes } = useGetDailyVolumeQuery()
    const { data: tvls } = useGetDailyTVLQuery()

    const handleOptions = (index: number) => {
        setIsActive(index)
    }
    useEffect(() => {
        options.map((item, index) => {
            if (item.link === pathname) {
                setIsActive(index)
            }
        })
    }, [pathname])

    if (pathname.startsWith('/explore/tokens/') || pathname.startsWith('/explore/pools/')) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col justify-start select-none w-full h-full px-[15vw] py-[2vw] space-y-[2vw]">
            <div className=" flex flex-row items-start space-x-[1vw] px-[1vw] w-full">
                <div className="w-[50%]">
                    <TVLChart tvls={tvls || []} />
                </div>
                <div className="w-[50%]">
                    <VolumeChart volumes={volumes || []} />
                </div>
            </div>
            <div className="flex flex-col w-full space-y-[1vw]">
                <div className="flex flex-row space-x-[2vw]">
                    {options.map((option, index) => {
                        return (
                            <Link key={index} href={option.link}>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleOptions(index)}
                                    key={index}
                                    className={`text-xl font-semibold opacity-50 ${isActive === index && 'opacity-85'}`}
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