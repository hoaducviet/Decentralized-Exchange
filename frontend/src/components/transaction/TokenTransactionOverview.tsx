'use client'
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Children, TokenActiveTransaction } from "@/lib/type"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
    children: Children;
    transaction: TokenActiveTransaction;
}

export default function TokenTransactionOverview({ children, transaction }: Props) {
    const [open, setOpen] = useState(false)

    const date = new Date(transaction.createdAt);
    const formattedDate = date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }); 
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="select-none w-[23vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                <DialogHeader className="bg-fixed w-full">
                    <DialogTitle >{transaction.type}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>Overview Token Transaction</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <div className="flex flex-col w-full h-full overflow-x-auto space-y-[1vw] mb-[1vw]">
                    {
                        transaction.type !== "Transfer Token" ?
                            <div className="flex flex-row justify-center items-center space-x-2">
                                <div className="flex flex-row justify-center items-center space-x-2">
                                    <Avatar className="w-[2vw] h-[2vw] max-w-[5vw] border border-blue-200">
                                        <AvatarImage src={transaction.from_token_id?.img} alt="One" />
                                        <AvatarFallback>T</AvatarFallback>
                                    </Avatar>
                                    <div className="text-md font-semibold">{transaction.from_token_id?.symbol}</div>
                                </div>
                                <ArrowRightIcon width={20} height={20} />
                                <div className="flex flex-row justify-center items-center space-x-2">
                                    <Avatar className="w-[2vw] h-[2vw] max-w-[5vw] border border-blue-200">
                                        <AvatarImage src={transaction.to_token_id?.img} alt="One" />
                                        <AvatarFallback>T</AvatarFallback>
                                    </Avatar>
                                    <div className="text-md font-semibold">{transaction.to_token_id?.symbol}</div>
                                </div>
                            </div>
                            :
                            <div className="flex flex-row justify-center items-center space-x-2">
                                <Avatar className="w-[2vw] h-[2vw] max-w-[5vw] border border-blue-200">
                                    <AvatarImage src={transaction.from_token_id?.img} alt="One" />
                                    <AvatarFallback>T</AvatarFallback>
                                </Avatar>
                                <div className="text-md font-semibold">{transaction.from_token_id?.symbol}</div>
                            </div>
                    }
                    <div className="flex flex-col space-y-4 text-sm divide-y-reverse-[5px]">
                        <div className="flex flex-row justify-between items-center">
                            <p>From</p>
                            <p>{`${transaction.from_wallet.slice(0, 6)}...${transaction.from_wallet.slice(38)}`}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>To</p>
                            <p>{`${transaction.to_wallet?.slice(0, 6)}...${transaction.to_wallet?.slice(38)}`}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Status</p>
                            <p>{transaction.status}</p>
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <p>Token</p>
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`- ${Number.isInteger(parseFloat(transaction.amount_in)) ? transaction.amount_in : parseFloat(transaction.amount_in).toFixed(6)}`}</p>
                                    <p className="font-semibold">{transaction.from_token_id?.symbol}</p>
                                </div>
                                <div className="flex flex-row space-x-1 justify-end text-xs italic">
                                    <p>Address:</p>
                                    <p>{`${transaction.from_token_id?.address?.slice(0, 6)}...${transaction.from_token_id?.address?.slice(38)}`}</p>
                                </div>
                            </div>
                        </div>
                        {
                            transaction.type !== "Transfer Token" &&
                            <div className="flex flex-row justify-between items-start">
                                <p>Token</p>
                                <div className="flex flex-col">
                                    <div className="flex flex-row space-x-1 justify-end">
                                        <p>{`+ ${Number.isInteger(parseFloat(transaction.amount_out || "")) ? transaction.amount_out : parseFloat(transaction.amount_out || "").toFixed(6)}`}</p>
                                        <p className="font-semibold">{transaction.to_token_id?.symbol}</p>
                                    </div>
                                    <div className="flex flex-row space-x-1 justify-end text-xs italic">
                                        <p>Address:</p>
                                        <p>{`${transaction.to_token_id?.address?.slice(0, 6)}...${transaction.to_token_id?.address?.slice(38)}`}</p>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="flex flex-row justify-between items-start">
                            <p>Price</p>
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`$${parseFloat(transaction.price || "")?.toFixed(2)}`}</p>
                                    <p className="font-semibold">USD</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <p>Platform fee (0.3%)</p>
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`$${parseFloat(transaction.platform_fee || "")?.toFixed(2)}`}</p>
                                    <p className="font-semibold">USD</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <p>Gas fee</p>
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`${parseFloat(transaction.gas_fee || "").toFixed(6)}`}</p>
                                    <p className="font-semibold">ETH</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Hash</p>
                            <p className="text-xs italic">{`${transaction.receipt_hash?.slice(0, 15)}...${transaction.receipt_hash?.slice(50)}`}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Time</p>
                            <p className="text-xs italic">{formattedDate}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}