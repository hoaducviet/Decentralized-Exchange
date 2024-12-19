'use client'
import { useState, useCallback, useEffect } from "react"
import { useAccount } from "wagmi"
import { useAddLiquidityTransactionMutation, useGetPoolsQuery, useGetTokenBalancesQuery, useUpdateLiquidityTransactionMutation } from "@/redux/features/api/apiSlice"
import { useWeb3 } from "@/hooks/useWeb3"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { removeLiquidityPool } from "@/services/liquiditypool/removeLiquidityPool"
import { TrashIcon } from "@radix-ui/react-icons"
import { LiquidBalancesType } from '@/lib/type'
import { Card } from "@/components/ui/card"
import { formatPrice } from "@/utils/formatPrice"
import { useToast } from '@/hooks/useToast'
import LiquidityTransactionWaiting from "@/components/transaction/LiquidityTransactionWaiting"
import { useGasRemoveLiquidity } from "@/hooks/useGas"
import { skipToken } from "@reduxjs/toolkit/query"
  
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
    const web3 = useWeb3()
    const provider = web3?.provider
    const signer = web3?.signer
    const { data: tokensBalance } = useGetTokenBalancesQuery(address ?? skipToken)
    const [ethBalance, setEthBalance] = useState<string>("")
    const [currentPool, setCurrentPool] = useState<LiquidBalancesType | undefined>(undefined)
    const [addLiquidityTransaction] = useAddLiquidityTransactionMutation()
    const [updateLiquidityTransaction] = useUpdateLiquidityTransactionMutation()
    const { data: pools } = useGetPoolsQuery()
    const { showError } = useToast()
    const gas = useGasRemoveLiquidity().toString()

    const handleClick = (index: number) => {
        setCurrentPool(liquidBalances[index])
    }

    useEffect(() => {
        if (tokensBalance) {
            const eth = tokensBalance.find(item => item.balance?.symbol === "ETH")
            setEthBalance(eth?.balance?.formatted ?? "")
        }
    }, [tokensBalance])

    const handleSend = useCallback(async () => {
        if (!!provider && !!signer && !!currentPool && !!address) {
            const { data: newTransaction } = await addLiquidityTransaction({
                type: 'Remove Liquidity',
                wallet: address,
                pool_id: currentPool.info._id,
                token1_id: currentPool.info.token1._id,
                token2_id: currentPool.info.token2._id,
            })
            try {
                const receipt = await removeLiquidityPool({ provider, signer, pool: currentPool, address })
                const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
                if (confirmedReceipt?.status === 1 && newTransaction?._id) {
                    updateLiquidityTransaction({
                        _id: newTransaction._id,
                        receipt_hash: receipt.hash,
                    })
                } else {
                    if (newTransaction?._id) {
                        updateLiquidityTransaction({
                            _id: newTransaction._id,
                            receipt_hash: ""
                        })
                    }
                }
                console.log(receipt)
            } catch (error) {
                console.error("Transaction error:", error);
                if (newTransaction?._id) {
                    updateLiquidityTransaction({
                        _id: newTransaction?._id,
                        receipt_hash: ""
                    })
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, signer, address, currentPool])

    const handleToast = () => {
        showError("Balance eth is not enough!")
    }

    return (
        <div className="flex flex-col select-none w-full space-y-[1vw]">
            <p className="text-xl font-semibold opacity-80">Liquidity Balances</p>
            <Card className="flex flex-col w-full rounded-2xl shadow-md">
                <div className="bg-secondary/100 flex flex-row w-full space-x-[2%] px-[1vw] h-[3vw] rounded-t-2xl ">
                    <div className="flex flex-col justify-center items-start text-base font-medium w-[5%]">{headers[0].name}</div>
                    <div className="flex flex-col justify-center items-start text-base font-medium w-[35%]">{headers[1].name}</div>
                    <div className="flex flex-col justify-center items-start text-base font-medium w-[25%]">{headers[2].name}</div>
                    <div className="flex flex-col justify-center items-start text-base font-medium w-[15%]">{headers[3].name}</div>
                    <div className="flex flex-col justify-center items-start text-base font-medium w-[20%]">{headers[4].name}</div>
                </div>
                <div className="flex flex-col w-full max-h-[40vw] overflow-x-auto">
                    {liquidBalances.map((liquidityBalance, index) => {
                        const pool = pools?.find(item => item.name === liquidityBalance.info.name)
                        const price = parseFloat(liquidityBalance.balance?.formatted || "") / parseFloat(liquidityBalance.balance?.total_supply || "") * parseFloat(pool?.total_tvl || "")
                        return (
                            <div key={index} className={`cursor-pointer flex flex-row items-center text-base font-medium space-x-[2%] hover:bg-secondary/80 dark:hover:bg-white/5 border-t-[0.2px] border-gray-300 border-opacity-20 w-full px-[1vw] py-[1vw] ${liquidBalances.length - 1 === index ? "rounded-b-2xl" : ""}`}>
                                <div className="flex flex-col justify-center items-start  w-[5%] ">{index + 1}</div>
                                <div className="flex flex-row justify-start items-center w-[35%]">
                                    <Avatar className="w-[1.7vw] h-[1.7vw] border border-black">
                                        <div className="realtive flex">
                                            <AvatarImage src={liquidityBalance.info.token1?.img}
                                                className="absolute w-full h-full object-cover"
                                                style={{ clipPath: "inset(0 50% 0 0)" }}
                                                alt="Token1" />
                                            <AvatarImage src={liquidityBalance.info.token2?.img}
                                                className="absolute w-full h-full object-cover"
                                                style={{ clipPath: "inset(0 0 0 50%)" }}
                                                alt="Token2" />
                                        </div>
                                        <AvatarFallback>{liquidityBalance.info.name}</AvatarFallback>
                                    </Avatar>
                                    <p className="flex justify-start font-semibold mx-[0.3vw]">{liquidityBalance.info.name}</p>
                                </div>
                                <div className="flex flex-col justify-center items-start  w-[25%]">{liquidityBalance.balance?.formatted}</div>
                                <div className="flex flex-col justify-center items-start  w-[15%]">{`$${formatPrice(price)}`}</div>
                                <div className="flex flex-col justify-center items-start  w-[20%]">
                                    {parseFloat(ethBalance) > 0 ?
                                        <LiquidityTransactionWaiting type="Remove Liquidity" handleSend={handleSend} address={address} liquidPool={currentPool} gasEth={gas}>
                                            <Button onClick={() => handleClick(index)} variant="ghost">
                                                <TrashIcon />
                                            </Button>
                                        </LiquidityTransactionWaiting>
                                        :
                                        <Button onClick={handleToast} variant="ghost">
                                            <TrashIcon />
                                        </Button>
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Card>
        </div>
    )
}
