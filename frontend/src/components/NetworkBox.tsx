
import Image from "next/image"
import ETH from '@/assets/images/network/eth.svg'

export default function NetworkBox() {

    return (
        <div className="flex flex-row justify-center items-center">
            <Image src={ETH} alt="S" className="w-[1.2vw] mr-1.5" />
            <div className="ml-1.5">Sepolia</div>
        </div>
    )
}