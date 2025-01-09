'use client'
import { useEffect, useState } from "react";
import { useGetPoolsQuery, useGetTokensQuery } from "@/redux/features/api/apiSlice";
import { Address, Children, LiquidBalancesType, ReservePool, Token, } from "@/lib/type"
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { ArrowRightIcon, PlusIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
    children: Children;
    handleSend: () => Promise<void>;
    type: string | "";
    tokenOne?: Token | undefined;
    tokenTwo?: Token | undefined;
    address: Address | undefined;
    pool?: ReservePool | undefined;
    liquidPool?: LiquidBalancesType | undefined;
    amount1?: string; 
    amount2?: string;
    gasEth: string;
}

export default function LiquidityTransactionWaiting({ children, handleSend, type, tokenOne, tokenTwo, address, pool, liquidPool, amount1, amount2, gasEth }: Props) {
    const [open, setOpen] = useState(false)
    const { data: tokens } = useGetTokensQuery()
    const eth = tokens?.find(item => item.symbol === 'ETH')
    const price1 = parseFloat(amount1 || "") * parseFloat(tokenOne?.price || "")
    const price2 = parseFloat(amount2 || "") * parseFloat(tokenTwo?.price || "")
    const price = price1 + price2
    const pricePlatform = price * 0.3 / 100
    const priceGas = parseFloat(eth?.price || "") * parseFloat(gasEth)
    const priceTotal = price + priceGas
    const { data: pools } = useGetPoolsQuery()
    const [priceLPT, setPriceLPT] = useState<string>("")
    const [pricePlatformLPT, setPricePlatformLPT] = useState<string>("")
    const [totalLPT, setTotalLPT] = useState<string>("")

    useEffect(() => {
        if (pools) {
            const pool = pools.find(item => item.name === liquidPool?.info.name)
            const pricelpt = parseFloat(liquidPool?.balance?.formatted || "") / parseFloat(liquidPool?.balance?.total_supply || "") * parseFloat(pool?.total_tvl || "")
            setPriceLPT(pricelpt.toString())
            setPricePlatformLPT((pricelpt * 0.3 / 100).toString())
            setTotalLPT((pricelpt * 0.3 / 100 + priceGas).toString())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pools, liquidPool])

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[25vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                <AlertDialogHeader className="bg-fixed w-full">
                    <AlertDialogTitle>{type}</AlertDialogTitle>
                    <VisuallyHidden>
                        <AlertDialogDescription>Information Transaction</AlertDialogDescription>
                    </VisuallyHidden>
                </AlertDialogHeader>
                <div className="flex flex-col w-full h-full overflow-x-auto space-y-[1vw] mb-[1vw]">
                    {
                        type !== "Remove Liquidity" ?
                            <div className="flex flex-row justify-center items-center space-x-2">
                                <div className="flex flex-row justify-center items-center space-x-2">
                                    <Avatar className="w-[2vw] h-[2vw] max-w-[5vw] border border-blue-200">
                                        <AvatarImage src={tokenOne?.img} alt="One" />
                                        <AvatarFallback>T</AvatarFallback>
                                    </Avatar>
                                    <div className="text-md font-semibold">{tokenOne?.symbol}</div>
                                </div>
                                <PlusIcon width={20} height={20} />
                                <div className="flex flex-row justify-center items-center space-x-2">
                                    <Avatar className="w-[2vw] h-[2vw] max-w-[5vw] border border-blue-200">
                                        <AvatarImage src={tokenTwo?.img} alt="One" />
                                        <AvatarFallback>T</AvatarFallback>
                                    </Avatar>
                                    <div className="text-md font-semibold">{tokenTwo?.symbol}</div>
                                </div>
                                <ArrowRightIcon width={20} height={20} />
                                <div className="flex flex-row justify-center items-center space-x-2">
                                    <Avatar className="w-[1.7vw] h-[1.7vw] border border-black">
                                        <div className="realtive flex">
                                            <AvatarImage src={pool?.info.token1?.img}
                                                className="absolute w-full h-full object-cover"
                                                style={{ clipPath: "inset(0 50% 0 0)" }}
                                                alt="Token1" />
                                            <AvatarImage src={pool?.info.token2?.img}
                                                className="absolute w-full h-full object-cover"
                                                style={{ clipPath: "inset(0 0 0 50%)" }}
                                                alt="Token2" />
                                        </div>
                                        <AvatarFallback>{pool?.info.name}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-md font-semibold">{pool?.info.name}</div>
                                </div>
                            </div>
                            :
                            <div className="flex flex-row justify-center items-center space-x-2">
                                <div className="flex flex-row justify-center items-center space-x-2">
                                    <Avatar className="w-[1.7vw] h-[1.7vw] border border-black">
                                        <div className="realtive flex">
                                            <AvatarImage src={liquidPool?.info.token1?.img}
                                                className="absolute w-full h-full object-cover"
                                                style={{ clipPath: "inset(0 50% 0 0)" }}
                                                alt="Token1" />
                                            <AvatarImage src={liquidPool?.info.token2?.img}
                                                className="absolute w-full h-full object-cover"
                                                style={{ clipPath: "inset(0 0 0 50%)" }}
                                                alt="Token2" />
                                        </div>
                                        <AvatarFallback>{liquidPool?.info.name}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-md font-semibold">{liquidPool?.info.name}</div>
                                </div>
                                <ArrowRightIcon width={20} height={20} />
                                <div className="flex flex-row justify-center items-center space-x-2">
                                    <Avatar className="w-[2vw] h-[2vw] max-w-[5vw] border border-blue-200">
                                        <AvatarImage src={liquidPool?.info.token1?.img} alt="One" />
                                        <AvatarFallback>T</AvatarFallback>
                                    </Avatar>
                                    <div className="text-md font-semibold">{liquidPool?.info.token1.symbol}</div>
                                </div>
                                <PlusIcon width={20} height={20} />
                                <div className="flex flex-row justify-center items-center space-x-2">
                                    <Avatar className="w-[2vw] h-[2vw] max-w-[5vw] border border-blue-200">
                                        <AvatarImage src={liquidPool?.info.token2?.img} alt="One" />
                                        <AvatarFallback>T</AvatarFallback>
                                    </Avatar>
                                    <div className="text-md font-semibold">{liquidPool?.info.token2.symbol}</div>
                                </div>
                            </div>
                    }
                    <div className="flex flex-col space-y-4 text-sm divide-y-reverse-[5px]">
                        <div className="flex flex-row justify-between items-center">
                            <p>From</p>
                            <p>{`${address?.slice(0, 6)}...${address?.slice(38)}`}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>To</p>
                            <p>{`${liquidPool?.info.address.slice(0, 6)}...${liquidPool?.info.address.slice(38)}`}</p>
                        </div>
                        {
                            type !== 'Remove Liquidity' ?
                                <>
                                    <div className="flex flex-row justify-between items-start">
                                        <p>Token</p>
                                        <div className="flex flex-col">
                                            <div className="flex flex-row space-x-1 justify-end">
                                                <p>{`- ${Number.isInteger(parseFloat(amount1 || "")) ? amount1 : parseFloat(amount1 || "").toFixed(6)}`}</p>
                                                <p className="font-semibold">{tokenOne?.symbol}</p>
                                            </div>
                                            <div className="flex flex-row space-x-1 justify-end">
                                                <p>{`- $${price1.toFixed(2)}`}</p>
                                                <p className="font-semibold">USD</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between items-start">
                                        <p>Token</p>
                                        <div className="flex flex-col">
                                            <div className="flex flex-row space-x-1 justify-end">
                                                <p>{`- ${Number.isInteger(parseFloat(amount2 || "")) ? amount2 : parseFloat(amount2 || "").toFixed(6)}`}</p>
                                                <p className="font-semibold">{tokenTwo?.symbol}</p>
                                            </div>
                                            <div className="flex flex-row space-x-1 justify-end">
                                                <p>{`- $${price2.toFixed(2)}`}</p>
                                                <p className="font-semibold">USD</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                <div className="flex flex-row justify-between items-start">
                                    <p>LP Token</p>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row space-x-1 justify-end">
                                            <p>{`- ${Number.isInteger(parseFloat(liquidPool?.balance?.formatted || "")) ? liquidPool?.balance?.formatted : parseFloat(liquidPool?.balance?.formatted || "").toFixed(6)}`}</p>
                                            <p className="font-semibold">{liquidPool?.info.name}</p>
                                        </div>
                                        <div className="flex flex-row space-x-1 justify-end">
                                            <p>{`- $${parseFloat(priceLPT).toFixed(2)}`}</p>
                                            <p className="font-semibold">USD</p>
                                        </div>
                                    </div>
                                </div>
                        }
                        <div className="flex flex-row justify-between items-start">
                            <p>Platform fee (0.3%)</p>
                            {
                                type !== 'Remove Liquidity' ?

                                    <div className="flex flex-col">
                                        <div className="flex flex-row justify-end items-center space-x-1">
                                            <div className="flex flex-row space-x-1 justify-end">
                                                <p>{`${(parseFloat(amount1 || "") * 0.3 / 100).toFixed(6)}`}</p>
                                                <p className="font-semibold">{tokenOne?.symbol}</p>
                                            </div>
                                            <div className="flex flex-row space-x-1 justify-end">
                                                <p>{`${(parseFloat(amount2 || "") * 0.3 / 100).toFixed(6)}`}</p>
                                                <p className="font-semibold">{tokenTwo?.symbol}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row space-x-1 justify-end">
                                            <p>{`$${pricePlatform.toFixed(2)}`}</p>
                                            <p className="font-semibold">USD</p>
                                        </div>
                                    </div>
                                    :
                                    <div className="flex flex-col">
                                        <div className="flex flex-row justify-end items-center space-x-1">
                                            <p>{`${(parseFloat(liquidPool?.balance?.formatted || "") * 0.3 / 100).toFixed(6)}`}</p>
                                            <p className="font-semibold">{liquidPool?.balance?.symbol}</p>
                                        </div>
                                        <div className="flex flex-row space-x-1 justify-end">
                                            <p>{`$${parseFloat(pricePlatformLPT).toFixed(2)}`}</p>
                                            <p className="font-semibold">USD</p>
                                        </div>
                                    </div>
                            }
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
                                {
                                    type !== "Remove Liquidity" ?
                                        <p>{`- $${priceTotal.toFixed(2)}`}</p>
                                        :
                                        <p>{`- $${parseFloat(totalLPT).toFixed(2)}`}</p>
                                }
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