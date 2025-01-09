'use client'
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Children, USDActiveTransaction } from "@/lib/type"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
    children: Children;
    transaction: USDActiveTransaction;
}

export default function PaymentTransactionOverview({ children, transaction }: Props) {
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
                    <DialogTitle className="flex flex-row justify-center" >{transaction.type}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>Overview Payment Transaction</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <div className="flex flex-col w-full h-full overflow-x-auto space-y-[1vw] mb-[1vw]">
                    <div className="flex flex-col space-y-4 text-sm divide-y-reverse-[5px]">
                        <div className="flex flex-row justify-between items-center">
                            <p>Method</p>
                            <p>{transaction.method}</p>
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <p>Price</p>
                            <div className="flex flex-row space-x-1 justify-end">
                                <p>{parseFloat(transaction.amount || "")?.toFixed(2)}</p>
                                <p className="font-semibold">{transaction.currency}</p>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Status</p>
                            <p>{transaction.status}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>From</p>
                            <p>{`${transaction.wallet.slice(0, 6)}...${transaction.wallet.slice(38)}`}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Payer</p>
                            <p>{transaction.payer_email}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Payee</p>
                            <p>{transaction.payee_email}</p>
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <p>Platform fee (3%)</p>
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`$${parseFloat(transaction.platform_fee || "")?.toFixed(2)}`}</p>
                                    <p className="font-semibold">{transaction.currency}</p>
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
                            <p>Order Id</p>
                            <p className="text-xs italic">{transaction.order_id}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Hash</p>
                            <p className="text-xs italic">{`${transaction.receipt_hash?.slice(0, 15)}...${transaction.receipt_hash?.slice(50)}`}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Time</p>
                            <p className="text-xs italic">{formattedDate}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Notes</p>
                            <p className="text-xs italic text-wrap">{transaction.notes}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}