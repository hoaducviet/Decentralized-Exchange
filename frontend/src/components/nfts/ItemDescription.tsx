'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bars3BottomLeftIcon } from '@heroicons/react/20/solid'
import { NFT } from "@/lib/type"

interface Props {
    nft: NFT | undefined
}

export default function ItemDescription({ nft }: Props) {
    return (
        <Card className="rounded-2xl my-0">
            <CardHeader className="my-0 py-4 rounded-t-2xl text-md font-semibold border-b-[1px]">
                <CardTitle className="flex flex-row space-x-2">
                    <Bars3BottomLeftIcon className="w-4 h-4" />
                    <div>Description</div>
                </CardTitle>
            </CardHeader>
            <CardContent className="my-0 py-4 min-h[2vw]">
                <div className="break-words">{nft?.description}</div>
            </CardContent>
        </Card>
    )
} 