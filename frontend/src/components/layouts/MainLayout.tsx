'use client'

import { useAccount } from "wagmi";
import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import SiderBar from "@/components/layouts/SiderBar";
interface Props {
    children: React.ReactNode
}

export default function MainLayout({ children }: Props) {
    const { isConnected } = useAccount()

    return (
        <div className="bg-transparent">
            <Header />
            <div className="relative flex flex-row">
                <div className="bg-green-700">
                    {children}
                </div>
                <div className="absolute top-0 right-0 w-[25%] bg-transparent">
                    {isConnected && <SiderBar />}
                </div>
            </div>
            <Footer />
        </div>
    )
}