'use client'
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Children, LiquidityActiveTransaction } from "@/lib/type"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRightIcon, PlusIcon } from "@radix-ui/react-icons";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
    children: Children;
    transaction: LiquidityActiveTransaction;
}

export default function LiquidityTransactionOverview({ children, transaction }: Props) {
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
                        <DialogDescription>Overview Transaction</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <div className="flex flex-col w-full h-full overflow-x-auto space-y-[1vw] mb-[1vw]">
                    {
                        transaction.type !== "Remove Liquidity" ?
                            <div className="flex flex-row justify-center items-center space-x-2">
                                <div className="flex flex-row justify-center items-center space-x-2">
                                    <Avatar className="w-[2vw] h-[2vw] max-w-[5vw] border border-blue-200">
                                        <AvatarImage src={transaction.token1_id?.img} alt="One" />
                                        <AvatarFallback>T</AvatarFallback>
                                    </Avatar>
                                    <div className="text-md font-semibold">{transaction.token1_id?.symbol}</div>
                                </div>
                                <PlusIcon width={20} height={20} />
                                <div className="flex flex-row justify-center items-center space-x-2">
                                    <Avatar className="w-[2vw] h-[2vw] max-w-[5vw] border border-blue-200">
                                        <AvatarImage src={transaction.token2_id?.img} alt="One" />
                                        <AvatarFallback>T</AvatarFallback>
                                    </Avatar>
                                    <div className="text-md font-semibold">{transaction.token2_id?.symbol}</div>
                                </div>
                                <ArrowRightIcon width={20} height={20} />
                                <div className="flex flex-row justify-center items-center space-x-2">
                                    <Avatar className="w-[1.7vw] h-[1.7vw] border border-black">
                                        <div className="realtive flex">
                                            <AvatarImage src={transaction.token1_id?.img}
                                                className="absolute w-full h-full object-cover"
                                                style={{ clipPath: "inset(0 50% 0 0)" }}
                                                alt="Token1" />
                                            <AvatarImage src={transaction.token2_id?.img}
                                                className="absolute w-full h-full object-cover"
                                                style={{ clipPath: "inset(0 0 0 50%)" }}
                                                alt="Token2" />
                                        </div>
                                        <AvatarFallback>{transaction.pool_id?.name}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-md font-semibold">{transaction.pool_id?.name}</div>
                                </div>
                            </div>
                            :
                            <div className="flex flex-row justify-center items-center space-x-2">
                                <div className="flex flex-row justify-center items-center space-x-2">
                                    <Avatar className="w-[1.7vw] h-[1.7vw] border border-black">
                                        <div className="realtive flex">
                                            <AvatarImage src={transaction.token1_id.img}
                                                className="absolute w-full h-full object-cover"
                                                style={{ clipPath: "inset(0 50% 0 0)" }}
                                                alt="Token1" />
                                            <AvatarImage src={transaction.token2_id.img}
                                                className="absolute w-full h-full object-cover"
                                                style={{ clipPath: "inset(0 0 0 50%)" }}
                                                alt="Token2" />
                                        </div>
                                        <AvatarFallback>{transaction.pool_id?.name}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-md font-semibold">{transaction.pool_id?.name}</div>
                                </div>
                                <ArrowRightIcon width={20} height={20} />
                                <div className="flex flex-row justify-center items-center space-x-2">
                                    <Avatar className="w-[2vw] h-[2vw] max-w-[5vw] border border-blue-200">
                                        <AvatarImage src={transaction.token1_id.img} alt="One" />
                                        <AvatarFallback>T</AvatarFallback>
                                    </Avatar>
                                    <div className="text-md font-semibold">{transaction.token1_id.symbol}</div>
                                </div>
                                <PlusIcon width={20} height={20} />
                                <div className="flex flex-row justify-center items-center space-x-2">
                                    <Avatar className="w-[2vw] h-[2vw] max-w-[5vw] border border-blue-200">
                                        <AvatarImage src={transaction.token2_id.img} alt="One" />
                                        <AvatarFallback>T</AvatarFallback>
                                    </Avatar>
                                    <div className="text-md font-semibold">{transaction.token2_id.symbol}</div>
                                </div>
                            </div>
                    }
                    <div className="flex flex-col space-y-4 text-sm divide-y-reverse-[5px]">
                        <div className="flex flex-row justify-between items-center">
                            <p>From</p>
                            <p>{`${transaction.wallet.slice(0, 6)}...${transaction.wallet?.slice(38)}`}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>To</p>
                            <p>{`${transaction.pool_id?.address.slice(0, 6)}...${transaction.pool_id?.address.slice(38)}`}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Status</p>
                            <p>{transaction.status}</p>
                        </div>
                        {
                            transaction.type !== 'Remove Liquidity' ?
                                <>
                                    <div className="flex flex-row justify-between items-start">
                                        <p>Token</p>
                                        <div className="flex flex-col">
                                            <div className="flex flex-row space-x-1 justify-end">
                                                <p>{`- ${Number.isInteger(parseFloat(transaction.amount_token1 || "")) ? transaction.amount_token1 : parseFloat(transaction.amount_token1 || "").toFixed(6)}`}</p>
                                                <p className="font-semibold">{transaction.token1_id?.symbol}</p>
                                            </div>
                                            <div className="flex flex-row space-x-1 justify-end text-xs italic">
                                                <p>Address:</p>
                                                <p>{`${transaction.token1_id?.address?.slice(0, 6)}...${transaction.token1_id?.address?.slice(38)}`}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between items-start">
                                        <p>Token</p>
                                        <div className="flex flex-col">
                                            <div className="flex flex-row space-x-1 justify-end">
                                                <p>{`- ${Number.isInteger(parseFloat(transaction.amount_token2 || "")) ? transaction.amount_token2 : parseFloat(transaction.amount_token2 || "").toFixed(6)}`}</p>
                                                <p className="font-semibold">{transaction.token2_id?.symbol}</p>
                                            </div>
                                            <div className="flex flex-row space-x-1 justify-end text-xs italic">
                                                <p>Address:</p>
                                                <p>{`${transaction.token2_id?.address?.slice(0, 6)}...${transaction.token2_id?.address?.slice(38)}`}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between items-start">
                                        <p>Token LP</p>
                                        <div className="flex flex-col">
                                            <div className="flex flex-row space-x-1 justify-end">
                                                <p>{`+ ${transaction.amount_lpt?.slice(0, transaction.amount_lpt.indexOf(".") + 7)}`}</p>
                                                <p className="font-semibold">{transaction.pool_id?.name}</p>
                                            </div>
                                            <div className="flex flex-row space-x-1 justify-end text-xs italic">
                                                <p>Address:</p>
                                                <p>{`${transaction.pool_id?.address_lpt?.slice(0, 6)}...${transaction.pool_id?.address_lpt?.slice(38)}`}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="flex flex-row justify-between items-start">
                                        <p>Token</p>
                                        <div className="flex flex-col">
                                            <div className="flex flex-row space-x-1 justify-end">
                                                <p>{`+ ${Number.isInteger(parseFloat(transaction.amount_token1 || "")) ? transaction.amount_token1 : parseFloat(transaction.amount_token1 || "").toFixed(6)}`}</p>
                                                <p className="font-semibold">{transaction.token1_id?.symbol}</p>
                                            </div>
                                            <div className="flex flex-row space-x-1 justify-end text-xs italic">
                                                <p>Address:</p>
                                                <p>{`${transaction.token1_id.address?.slice(0, 6)}...${transaction.token1_id.address?.slice(38)}`}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between items-start">
                                        <p>Token</p>
                                        <div className="flex flex-col">
                                            <div className="flex flex-row space-x-1 justify-end">
                                                <p>{`+ ${Number.isInteger(parseFloat(transaction.amount_token2 || "")) ? transaction.amount_token2 : parseFloat(transaction.amount_token2 || "").toFixed(6)}`}</p>
                                                <p className="font-semibold">{transaction.token2_id?.symbol}</p>
                                            </div>
                                            <div className="flex flex-row space-x-1 justify-end text-xs italic">
                                                <p>Address:</p>
                                                <p>{`${transaction.token2_id.address?.slice(0, 6)}...${transaction.token2_id.address?.slice(38)}`}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between items-start">
                                        <p>Token LP</p>
                                        <div className="flex flex-col">
                                            <div className="flex flex-row space-x-1 justify-end">
                                                <p>{`- ${transaction.amount_lpt?.slice(0, transaction.amount_lpt.indexOf(".") + 7)}`}</p>
                                                <p className="font-semibold">{transaction.pool_id.name}</p>
                                            </div>
                                            <div className="flex flex-row space-x-1 justify-end text-xs italic">
                                                <p>Address:</p>
                                                <p>{`${transaction.pool_id.address_lpt?.slice(0, 6)}...${transaction.pool_id.address_lpt?.slice(38)}`}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                        }
                        <div className="flex flex-row justify-between items-start">
                            <p>Platform fee (0.3%)</p>
                            {
                                transaction.type !== 'Remove Liquidity' ?
                                    <div className="flex flex-col justify-start items-end">
                                        <div className="flex flex-row space-x-1 justify-end">
                                            <p>{`${(parseFloat(transaction.amount_token1 || "") * 0.3 / 100).toFixed(6)}`}</p>
                                            <p className="font-semibold">{transaction.token1_id?.symbol}</p>
                                        </div>
                                        <div className="flex flex-row space-x-1 justify-end">
                                            <p>{`${(parseFloat(transaction.amount_token2 || "") * 0.3 / 100).toFixed(6)}`}</p>
                                            <p className="font-semibold">{transaction.token2_id?.symbol}</p>
                                        </div>
                                    </div>
                                    :
                                    <div className="flex flex-col">
                                        <div className="flex flex-row justify-end items-center space-x-1">
                                            <p>{`${(parseFloat(transaction.amount_lpt || "") * 0.3 / 100).toFixed(6)}`}</p>
                                            <p className="font-semibold">{transaction.pool_id?.name}</p>
                                        </div>
                                    </div>
                            }
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