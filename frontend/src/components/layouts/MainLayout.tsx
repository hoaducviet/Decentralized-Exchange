'use client'
import { useAccount } from "wagmi";
import Header from "@/components/layouts/Header";
import SiderBar from "@/components/layouts/SiderBar";
import Footer from "@/components/layouts/Footer";
import { type Children } from "@/lib/type";
import { useEffect } from "react";
import { getWss } from '@/redux/features/api/apiSlice'
interface Props {
    children: Children;
} 

export default function MainLayout({ children }: Props) {
    const { isConnected, address } = useAccount()
    useEffect(() => {
        if (address) {
            localStorage.setItem('address', address)
        } else {
            localStorage.setItem('address', "")
        }
        getWss()
    }, [address])

    return (
        <div className="bg-transparent w-[100vw]">
            <Header />
            <div className="flex flex-row w-full min-h-[100vh]">
                <div className="flex flex-col w-full h-full">
                    {children}
                </div>
                <div className="absolute top-0 right-0 w-[25vw] bg-transparent">
                    {isConnected && address && <SiderBar address={address} />}
                </div>
            </div>
            <Footer />
        </div>
    )
}