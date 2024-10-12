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
        <div className="bg-transparent">
            <Header />
            <div className="relative flex flex-row w-full">
                <div className="flex flex-col w-[100vw] h-[100vh]">
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