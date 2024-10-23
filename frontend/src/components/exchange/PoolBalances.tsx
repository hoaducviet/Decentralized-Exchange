'use client'
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useWeb3 } from "@/hooks/useWeb3"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { resetBalances } from "@/redux/features/balances/balancesSlice"
import { removeLiquidityPool } from "@/services/liquiditypool/removeLiquidityPool"
import { TrashIcon } from "@radix-ui/react-icons"
import { LiquidBalancesType } from '@/lib/type'
import { useAccount } from "wagmi"

const headers = [
    { name: "#" },
    { name: "Pool" },
    { name: "Amount Token" },
    { name: "USD" },
    { name: "Withdraw" },
]

interface Props {
    liquidBalances: LiquidBalancesType[];
}

export default function PoolBalances({ liquidBalances }: Props) {
    const { address } = useAccount()
    const dispatch = useDispatch()
    const web3 = useWeb3()
    const provider = web3?.provider
    const signer = web3?.signer
    const [currentPool, setCurrentPool] = useState<LiquidBalancesType | undefined>(undefined)

    const handleClick = (index: number) => {
        setCurrentPool(liquidBalances[index])
    }

    const handleSend = async () => {
        if (!!provider && !!signer && !!currentPool && !!address) {
            try {
                const receipt = await removeLiquidityPool({ provider, signer, pool: currentPool, address })
                const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
                if (confirmedReceipt?.status === 1) {
                    dispatch(resetBalances())
                } else {
                    console.error("Transaction error:", confirmedReceipt);
                }
                console.log(confirmedReceipt)
            } catch (error) {
                console.error("Transaction error:", error);
            }
        }
    }
    return (
        <div className="flex flex-col select-none w-full shadow-lg">
            <p className="text-xl font-semibold opacity-80">Liquidity Balances</p>
            <div className="flex flex-col w-full">
                <div className="bg-secondary/100 flex flex-row w-full space-x-[2%] px-[1vw] h-[2.5vw]">
                    <div className="flex flex-col justify-center items-start text-base font-medium w-[5%]">{headers[0].name}</div>
                    <div className="flex flex-col justify-center items-start text-base font-medium w-[35%]">{headers[1].name}</div>
                    <div className="flex flex-col justify-center items-start text-base font-medium w-[25%]">{headers[2].name}</div>
                    <div className="flex flex-col justify-center items-start text-base font-medium w-[15%]">{headers[3].name}</div>
                    <div className="flex flex-col justify-center items-start text-base font-medium w-[20%]">{headers[4].name}</div>
                </div>
                <div className="flex flex-col w-full max-h-[40vw] overflow-x-auto">
                    {liquidBalances.map((liquidityBalance, index) => {
                        return (
                            <div key={index} className=" cursor-pointer flex flex-row items-center text-base font-medium space-x-[2%] hover:bg-secondary/80 w-full px-[1vw] py-[1vw]">
                                <div className="flex flex-col justify-center items-start  w-[5%] ">{index + 1}</div>
                                <div className="flex flex-row justify-start items-center w-[35%]">
                                    <Avatar className="w-[1.7vw] h-[1.7vw] border border-black">
                                        <div className="realtive flex">
                                            <AvatarImage src={liquidityBalance.info.token1?.img}
                                                className="absolute w-full h-full object-cover"
                                                style={{ clipPath: "inset(0 50% 0 0)" }} />
                                            <AvatarImage src={liquidityBalance.info.token2?.img}
                                                className="absolute w-full h-full object-cover"
                                                style={{ clipPath: "inset(0 0 0 50%)" }} />
                                        </div>
                                        <AvatarFallback>{liquidityBalance.info.name}</AvatarFallback>
                                    </Avatar>
                                    <p className="flex justify-start font-semibold mx-[0.3vw]">{liquidityBalance.info.name}</p>
                                </div>
                                <div className="flex flex-col justify-center items-start  w-[25%]">{liquidityBalance.balance?.formatted}</div>
                                <div className="flex flex-col justify-center items-start  w-[15%]">100 USD</div>
                                <div className="flex flex-col justify-center items-start  w-[20%]">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button onClick={() => handleClick(index)} variant="ghost">
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
                                                <AlertDialogAction onClick={handleSend}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
