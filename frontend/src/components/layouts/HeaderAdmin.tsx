import Link from "next/link"
import Image from "next/image"
import routes from "@/config/configRoutes"
import ConnectWallet from "@/components/wallet/ConnectWallet"
import SearchForm from "@/components/SearchForm"
import ThemeMode from "@/components/ThemeMode"
import NetworkBox from "@/components/NetworkBox"
 
export default function HeaderAdmin() {
    return <div className="bg-transparent flex justify-between items-center h-16">
        <div className="flex flex-row items-center">
            <Link href={routes.admin}>
                <div className="mx-5">
                    <Image src="/image/logo-admin.png" priority={true} alt="logo" width={180} height={50} className="w-[13vw] h-[2vw] object-cover" />
                </div>
            </Link>
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