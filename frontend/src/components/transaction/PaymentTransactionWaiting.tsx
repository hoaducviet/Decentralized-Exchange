'use client'
import { useState } from "react";
import { useGetTokensQuery } from "@/redux/features/api/apiSlice";
import { Address, Children } from "@/lib/type"
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
    children: Children;
    handleSend: () => Promise<void>;
    type: string;
    address: Address | undefined;
    amount: string;
    email: string;
    gasEth: string;
    currency?: string;
} 

export default function PaymentTransactionWaiting({ children, handleSend, type, address, amount, currency = "USD", email, gasEth }: Props) {
    const [open, setOpen] = useState(false)
    const { data: tokens } = useGetTokensQuery()
    const eth = tokens?.find(item => item.symbol === 'ETH')
    const usd = tokens?.find(item => item.symbol === 'USD')
    const priceGas = parseFloat(gasEth) * parseFloat(eth?.price || "")
    const priceTotal = parseFloat(amount) + priceGas

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                <AlertDialogHeader className="bg-fixed w-full">
                    <AlertDialogTitle>{type}</AlertDialogTitle>
                    <VisuallyHidden>
                        <AlertDialogDescription>Information Payment Transaction</AlertDialogDescription>
                    </VisuallyHidden>
                </AlertDialogHeader>
                <div className="flex flex-col w-full h-full overflow-x-auto space-y-[1vw] mb-[1vw]">
                    <div className="flex flex-row justify-center items-center space-x-2">
                        <Avatar className="w-[2vw] h-[2vw] max-w-[5vw] border border-blue-200">
                            <AvatarImage src={usd?.img} alt="One" />
                            <AvatarFallback>T</AvatarFallback>
                        </Avatar>
                        <div className="text-md font-semibold">{usd?.symbol}</div>
                    </div>
                    <div className="flex flex-col space-y-4 text-sm divide-y-reverse-[5px]">
                        <div className="flex flex-row justify-between items-center">
                            <p>From</p>
                            <p>{`${address?.slice(0, 6)}...${address?.slice(38)}`}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Email</p>
                            <p>{email}</p>
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <p>Value</p>
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`$${parseFloat(amount).toFixed(2)}`}</p>
                                    <p className="font-semibold">{currency}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <p>Platform fee (3%)</p>
                            <div className="flex flex-row space-x-1 justify-end">
                                <p>{`$${(parseFloat(amount) * 3 / 100).toFixed(2)}`}</p>
                                <p className="font-semibold">{currency}</p>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <p>Gas fee max</p>
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`${parseFloat(gasEth).toFixed(2)}`}</p>
                                    <p className="font-semibold">{eth?.symbol}</p>
                                </div>
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`$${priceGas.toFixed(2)}`}</p>
                                    <p className="font-semibold">USD</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>Total</p>
                            <div className="flex flex-row space-x-1 justify-end">
                                <p>{`- $${priceTotal.toFixed(2)}`}</p>
                                <p className="font-semibold">USD</p>
                            </div>
                        </div>
                    </div>

                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel >Close</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSend} >Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}