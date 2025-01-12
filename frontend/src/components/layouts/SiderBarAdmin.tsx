'use client'

import Link from "next/link"
import { useState } from "react"
import { useDisconnect } from "wagmi"

const options = [
    {
        name: 'Token',
        link: '/admin/token'
    },
    {
        name: 'Pool',
        link: '/admin/pool'
    },
    {
        name: 'Collection',
        link: '/admin/collection'
    },
    {
        name: 'Register',
        link: '/admin/collection/register'
    },
    {
        name: 'Physical Asset',
        link: '/admin/physicalasset'
    },
    {
        name: 'Account',
        link: '/admin/account'
    }
]

export default function SiderBarAdmin() {
    const { disconnect } = useDisconnect()
    const [isActive, setIsActive] = useState<number | undefined>(undefined)

    const handleClick = (index: number) => {
        setIsActive(index)
    }

    const handleDisconnect = () => {
        disconnect()
        if (localStorage.getItem('token')) {
            localStorage.removeItem('token')
        }
    }

    return (
        <div className="select-none flex flex-col justify-between h-full border-r-[1px]">
            <div className="flex flex-col justify-start py-[1vw]">
                <div className="flex flex-row justify-center border-b-[1px] items-center w-full font-semibold text-2xl py-[1vw]">Menu</div>
                <div className=" flex flex-col w-full ">
                    {options.map((item, index) =>
                    (
                        <div key={index} onClick={() => handleClick(index)} className={` hover:bg-secondary cursor-pointer flex flex-row border-b-[1px] justify-start items-center text-xl font-medium h-[3.5vw] px-[1.5vw] ${isActive === index ? "bg-secondary/80" : ""}`}><Link href={item.link}>{item.name}</Link></div>
                    ))}
                </div>
            </div>
            <div onClick={handleDisconnect} className="bg-secondary/80 hover:bg-secondary cursor-pointer flex flex-row border-b-[1px] justify-center items-center text-xl font-medium h-[3.5vw] px-[1.5vw]">Logout</div>
        </div>
    )
}
