
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

export default function Transactions() {

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow className="w-full h-[3vw] bg-secondary/80">
                        <TableHead className="w-[100px]">Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>USD</TableHead>
                        <TableHead>WBTC</TableHead>
                        <TableHead>ETH</TableHead>
                        <TableHead>Wallet</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tokens.map((token, index) => {
                        return (
                            <TableRow key={index} className="cursor-pointer w-full h-[4vw] text-lg font-semibold opacity-85">
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>
                                    <div className="flex flex-row items-center space-x-[0.3vw]">
                                        <Image src={token.img} alt={token.name} width={36} height={36} className="opacity-100" />
                                        <p>{token.ticker}</p>
                                    </div>
                                </TableCell>
                                <TableCell>$1000</TableCell>
                                <TableCell>1.5%</TableCell>
                                <TableCell>1.5%</TableCell>
                                <TableCell>0x112...12312</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}