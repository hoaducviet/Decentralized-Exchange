'use client'

import Link from "next/link"
import { publicRoutes } from "@/routes/routes"
import ConnectWallet from "@/components/wallet/ConnectWallet"

export default function Header() {

    return <div className="bg-blue-500 flex justify-between">
        <div className="flex flex-row">
            {publicRoutes.map((item, index) => {
                return (
                    <Link
                        key={index}
                        href={item.path}
                        className="mx-2"
                    >
                        {item.content}
                    </Link>
                )
            })}
        </div>
        <div className="mx-5">
            <ConnectWallet />
        </div>
    </div>
}