import ConnectWallet from "@/components/wallet/ConnectWallet"
import SearchForm from "@/components/SearchForm"
import ThemeMode from "@/components/ThemeMode"
import NetworkBox from "@/components/NetworkBox"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { publicRoutes } from "@/routes/routes"
import routes from "@/config/configRoutes"

export default function Header() {

    return <div className="bg-transparent flex justify-between items-center">
        <div className="flex flex-row items-center">
            <Link href={routes.home}>
                <div className="mx-5">
                    <Image src="/image/logo.svg" alt="logo" width={180} height={50} />
                </div>
            </Link>
            {publicRoutes.map((item, index) => {
                return (
                    <Link
                        key={index}
                        href={item.path}
                        className="mx-2"
                    >
                        <Button variant="link">
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