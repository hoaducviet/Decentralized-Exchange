'use client'
import { useState } from "react";
import { useGetTokensQuery } from "@/redux/features/api/apiSlice";
import { Address, Children, ReservePool, Token, } from "@/lib/type"
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription, AlertDialogOverlay } from "@/components/ui/alert-dialog";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
    children: Children;
    handleSend: () => Promise<void>;
    type: string | "";
    tokenOne: Token | undefined;
    tokenTwo?: Token | undefined;
    address: Address | undefined;
    addressReceiver?: Address | undefined;
    pool?: ReservePool | undefined;
    value: string;
    gasEth: string;

}

export default function TokenTransactionWaiting({ children, handleSend, type, tokenOne, tokenTwo, address, addressReceiver, pool, value, gasEth }: Props) {
    const [open, setOpen] = useState(false)
    const { data: tokens } = useGetTokensQuery()
    const eth = tokens?.find(item => item.symbol === 'ETH')
    const price = parseFloat(value) * parseFloat(tokenOne?.price || "")
    const pricePlatform = parseFloat(value) * 0.3 / 100 * parseFloat(tokenOne?.price || "")
    const priceGas = parseFloat(eth?.price || "") * parseFloat(gasEth)
    const priceTotal = price + priceGas

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                <AlertDialogHeader className="bg-fixed w-full">
                    <AlertDialogTitle>{type}</AlertDialogTitle>
                    <VisuallyHidden>
                        <AlertDialogDescription>Transactions</AlertDialogDescription>
                        <VisuallyHidden>
                            <AlertDialogOverlay>Information Token Transaction</AlertDialogOverlay>
                        </VisuallyHidden>
                    </VisuallyHidden>
                </AlertDialogHeader>
                <div className="flex flex-col w-full h-full overflow-x-auto space-y-[1vw] mb-[1vw]">
                    {
                        type !== "Transfer Token" ?
                            <div className="flex flex-row justify-center items-center space-x-2">
                                <div className="flex flex-row justify-center items-center space-x-2">
                                    <Avatar className="w-[2vw] h-[2vw] max-w-[5vw] border border-blue-200">
                                        <AvatarImage src={tokenOne?.img} alt="One" />
                                        <AvatarFallback>T</AvatarFallback>
                                    </Avatar>
                                    <div className="text-md font-semibold">{tokenOne?.symbol}</div>
                                </div>
                                <ArrowRightIcon width={20} height={20} />
                                <div className="flex flex-row justify-center items-center space-x-2">
                                    <Avatar className="w-[2vw] h-[2vw] max-w-[5vw] border border-blue-200">
                                        <AvatarImage src={tokenTwo?.img} alt="One" />
                                        <AvatarFallback>T</AvatarFallback>
                                    </Avatar>
                                    <div className="text-md font-semibold">{tokenTwo?.symbol}</div>
                                </div>
                            </div>
                            :
                            <div className="flex flex-row justify-center items-center space-x-2">
                                <Avatar className="w-[2vw] h-[2vw] max-w-[5vw] border border-blue-200">
                                    <AvatarImage src={tokenOne?.img} alt="One" />
                                    <AvatarFallback>T</AvatarFallback>
                                </Avatar>
                                <div className="text-md font-semibold">{tokenOne?.symbol}</div>
                            </div>
                    }
                    <div className="flex flex-col space-y-4 text-sm divide-y-reverse-[5px]">
                        <div className="flex flex-row justify-between items-center">
                            <p>From</p>
                            <p>{`${address?.slice(0, 6)}...${address?.slice(38)}`}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>To</p>
                            {
                                type !== "Transfer Token" ?
                                    <p>{`${pool?.info.address.slice(0, 6)}...${pool?.info.address.slice(38)}`}</p>
                                    :
                                    <p>{`${addressReceiver?.slice(0, 6)}...${addressReceiver?.slice(38)}`}</p>
                            }
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <p>Value</p>
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`- ${Number.isInteger(parseFloat(value)) ? value : parseFloat(value).toFixed(6)}`}</p>
                                    <p className="font-semibold">{tokenOne?.symbol}</p>
                                </div>
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`- $${price.toFixed(2)}`}</p>
                                    <p className="font-semibold">USD</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <p>Platform fee (0.3%)</p>
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`${(parseFloat(value) * 0.3 / 100).toFixed(6)}`}</p>
                                    <p className="font-semibold">{tokenOne?.symbol}</p>
                                </div>
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`$${pricePlatform.toFixed(2)}`}</p>
                                    <p className="font-semibold">USD</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <p>Gas fee max</p>
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`${parseFloat(gasEth).toFixed(6)}`}</p>
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
                                <p>{`$${priceTotal.toFixed(2)}`}</p>
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