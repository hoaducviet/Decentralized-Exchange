'use client'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRole } from '@/hooks/useRole';
import { useToast } from "@/hooks/useToast";
import { useLoginMutation } from '@/redux/features/api/apiSlice'
import { getWss } from '@/redux/features/api/apiSlice'
import Header from "@/components/layouts/Header";
import HeaderAdmin from "@/components/layouts/HeaderAdmin";
import SiderBar from "@/components/layouts/SiderBar";
import SiderBarAdmin from "@/components/layouts/SiderBarAdmin";
import Footer from "@/components/layouts/Footer";
import FooterAdmin from "@/components/layouts/FooterAdmin";
import { type Children } from "@/lib/type";

interface Props {
    children: Children;
}

export default function MainLayout({ children }: Props) {
    const { isConnected, address } = useAccount()
    const { showError, showSuccess } = useToast()
    const [login, { isSuccess, isError }] = useLoginMutation()
    const [token, setToken] = useState<string>("")
    const role = useRole(token)
    const router = useRouter()


    useEffect(() => {
        if (role === 'admin') {
            router.push('/admin')
        } else {
            router.push('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role])

    useEffect(() => {
        if (address) {
            localStorage.setItem('address', address)
        } else {
            localStorage.setItem('address', "")
        }
        getWss()
    }, [address])

    useEffect(() => {
        const getToken = async () => {
            if (isConnected && address) {
                const { data: newToken } = await login({
                    wallet: address,
                    walletAccess: isConnected
                })
                localStorage.setItem('token', newToken?.token || "")
                setToken(localStorage.getItem('token') || "")
                if (isSuccess) {
                    showSuccess("Login successfully!")
                }
                if (isError) {
                    showError("Login failed!")
                }
            } else {
                if (localStorage.getItem('token')) {
                    console.log("Token", localStorage.getItem('token'))
                    localStorage.removeItem('token')
                    setToken(localStorage.getItem('token') || "")
                }
            }
        }
        getToken()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, address])

    return (
        <>
            {role !== 'admin' ?
                <div className="bg-transparent w-[100vw]" >
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
                </div >
                :
                <div className="bg-transparent w-[100vw]">
                    <HeaderAdmin />
                    <div className="flex flex-row w-full h-[90vh] overflow-x-hidden">
                        <div className="w-[20%]"><SiderBarAdmin /></div>
                        <div className="w-[80%]">{children}</div>
                    </div>
                    <FooterAdmin />
                </div>
            }
        </>
    )
}