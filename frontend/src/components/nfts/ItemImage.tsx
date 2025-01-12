import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { NFT } from "@/lib/type"
import { TagIcon } from "@heroicons/react/20/solid"

interface Props {
    nft: NFT | undefined
}

const chain = "Ethereum"
const strList = "Listed"
export default function ItemImage({ nft }: Props) {
    return (
        <Card className="rounded-2xl min-w-[5vw] min-h-[5vw]">
            <CardHeader className="my-0 py-2 rounded-t-2xl text-md font-semibold px-0">
                <div className="relative flex flex-row items-center space-x-2 py-2">
                    <CardTitle className="flex flex-row w-full justify-center items-center text-md">
                        {nft?.name}
                    </CardTitle>
                    <div className="absolute left-[0.5vw] flex flex-row justify-start items-end space-x-1">
                        <Image src="/image/ether-icon.png" priority={true} alt="Ethereum" width={2} height={2} className="w-5 h-5" />
                        <p className="text-sm ">{chain}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="relative mx-0 px-0 pb-0">
                <Image src={nft?.img || "/image/default-image.png"} priority={true} alt={nft?.name || 'NFT'} width={20} height={20} className="w-full h-full rounded-b-2xl" />
                {
                    nft?.isListed &&
                    <div className="bg-white/90 dark:bg-black/50 flex flex-row space-x-2 items-center border-red-500 border-l-[1px] border-t-[1px] text-red-500 absolute right-0 bottom-0 px-3 py-1 rounded-tl-2xl rounded-br-2xl font-semibold text-md">
                        <TagIcon className='w-[1vw] h-[1vw]' />
                        <p>
                            {strList}
                        </p>
                    </div>
                }
            </CardContent>
        </Card>
    )
} 