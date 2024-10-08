import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { publicRoutes } from "@/routes/routes"
import ConnectWallet from "@/components/wallet/ConnectWallet"
import ETH from '@/assets/images/network/eth.svg'
import SearchForm from "@/components/SearchForm"
import routes from "@/config/configRoutes"

export default function Header() {

    return <div className="bg-white flex justify-between items-center">
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
        <div className="flex flex-row items-center mx-5">
            <div className="flex flex-row mr-5">
                <Image src={ETH} alt="S" className="w-[24px] mx-2" />
                <div className="flex items-center mx-2">Sepolia</div>
            </div>
            <div className="flex flex-row items-center mx-5">
                <Switch id="dark-mode" className="mx-2" />
                <Label htmlFor="dark-mode" className="mx-2">Mode</Label>
            </div>
            <ConnectWallet />
        </div>
    </div>
}