'use client'
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import routes from "@/config/configRoutes"
import { publicRoutes } from "@/routes/routes"
import ConnectWallet from "@/components/wallet/ConnectWallet"
import SearchForm from "@/components/SearchForm"
import ThemeMode from "@/components/ThemeMode"
import NetworkBox from "@/components/NetworkBox"
import { Button } from "@/components/ui/button"

export default function Header() {
    const [isActive, setIsActive] = useState<number>(-1)
    return <div className="bg-transparent flex justify-between items-center h-16">
        <div className="flex flex-row items-center">
            <Link href={routes.home}>
                <div className="mx-5">
                    <Image src="/image/logo.png" alt="logo" priority={true} width={180} height={50} className="w-[9vw] h-[2vw] object-cover" />
                </div>
            </Link>
            {publicRoutes.map((item, index) => {
                return (
                    <Link
                        key={index}
                        href={item.path}
                        className="mx-2"
                    >
                        <Button onClick={() => setIsActive(index)} variant="link" className={`${isActive === index ? "underline" : ""}`}>
                            {item.content}
                        </Button>
                    </Link>
                )
            })}
        </div>
        <div className="flex items-center justify-center w-[25%]">
            <SearchForm />
        </div>
        <div className="flex flex-row justify-around items-center w-[25%]">
            <NetworkBox />
            <ThemeMode />
            <ConnectWallet />
        </div>
    </div>
}