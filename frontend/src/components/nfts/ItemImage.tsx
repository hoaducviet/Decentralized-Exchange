import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { NFT } from "@/lib/type"

interface Props {
    nft: NFT | undefined
}

export default function ItemImage({ nft }: Props) {
    return (
        <Card className="rounded-2xl">
            <CardHeader className="my-0 py-2 rounded-t-2xl text-md font-semibold">
                <div className="flex flex-row items-center justify-start space-x-2">
                    <div>
                        <Image src="/image/ether-icon.png" alt="Ethereum" width={2} height={2} className="w-5 h-5" />
                    </div>
                    <CardTitle>
                        {nft?.name}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="mx-0 px-0 pb-0">
                <Image src={nft?.img || "/image/default-image.png"} alt={nft?.name || 'NFT'} width={20} height={20} className="w-full h-full rounded-b-2xl" />
            </CardContent>
        </Card>
    )
}