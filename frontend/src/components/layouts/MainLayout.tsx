'use client'
import { useAccount } from "wagmi";
import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import SiderBar from "@/components/layouts/SiderBar";
import { type Children } from "@/lib/type";
interface Props {
    children: Children;
}

export default function MainLayout({ children }: Props) {
    const { isConnected } = useAccount()
    return (
        <div className="bg-transparent w-[100vw]">
            <Header />
            <div className="relative flex flex-row w-full min-h-[100vh]">
                <div className="flex flex-col w-full h-full">
                    {children}
                </div>
                <div className="absolute top-0 right-0 w-[25vw] bg-transparent">
                    {isConnected && <SiderBar />}
                </div>
            </div>
            <Footer />
        </div>
    )
}