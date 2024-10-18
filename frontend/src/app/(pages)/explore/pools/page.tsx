
'use client'

import Image from "next/image"
import tokensErc20 from '@/assets/token/tokenList.json'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Token } from "@/lib/type"

const tokens: Token[] = tokensErc20 as Token[]

export default function Pools() {

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow className="w-full h-[3vw] bg-secondary/80">
                        <TableHead className="w-[100px]">#</TableHead>
                        <TableHead>Pool</TableHead>
                        <TableHead>TVL</TableHead>
                        <TableHead>1D vol</TableHead>
                        <TableHead className="text-right">7D vol</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tokens.map((token, index) => {
                        return (
                            <TableRow key={index} className="cursor-pointer w-full h-[4vw] text-lg font-semibold opacity-80">
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>
                                    <div className="flex flex-row items-center space-x-[0.3vw]">
                                        <Image src={token.img} alt={token.name} width={36} height={36} className="opacity-100" />
                                        <p className="opacity-60">{token.ticker}</p>
                                    </div>
                                </TableCell>
                                <TableCell>$1000</TableCell>
                                <TableCell>1.5%</TableCell>
                                <TableCell className="text-right">$7.5B</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}