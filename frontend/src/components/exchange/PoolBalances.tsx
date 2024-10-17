'use client'

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { TrashIcon } from "@radix-ui/react-icons"

const list = [
    {
        name: 'ETH/DAI',
        balance: '100',
        date: '1-1-2024',
        price: '100USD'

    },
    {
        name: 'ETH/DAI',
        balance: '100',
        date: '1-1-2024',
        price: '100USD'
    },
    {
        name: 'ETH/DAI',
        balance: '100',
        date: '1-1-2024',
        price: '100USD'

    }
]
export default function PoolBalances() {

    return (
        <div className="flex flex-col select-none w-full shadow-lg">
            <p className="text-xl font-semibold opacity-80">Liquidity Balances</p>
            <Table>
                <TableHeader>
                    <TableRow className="w-full h-[3vw] bg-secondary/80">
                        <TableHead className="w-[100px]">#</TableHead>
                        <TableHead>Pool</TableHead>
                        <TableHead>Amount Token</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Price</TableHead>
                        <TableCell className="text-right"></TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {list.map((token, index) => {
                        return (
                            <TableRow key={index} className="cursor-pointer w-full h-[3vw]">
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{token.name}</TableCell>
                                <TableCell>{token.balance}</TableCell>
                                <TableCell>{token.date}</TableCell>
                                <TableCell>{token.price}</TableCell>
                                <TableCell className="text-right">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost">
                                                            <TrashIcon />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                            This will permanently withdraw your liquidity and send your tokens from liquidity pool.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction>Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Withdraw liquidity</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4}>Total</TableCell>
                        <TableCell >$2,500.00</TableCell>
                        <TableCell className="text-right"></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}