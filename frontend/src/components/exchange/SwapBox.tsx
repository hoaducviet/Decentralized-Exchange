'use client'
import { useCallback, useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { useWeb3 } from "@/hooks/useWeb3"
import { useToast } from '@/hooks/useToast'
import { useGetTokenBalancesQuery, useGetTokensQuery, useGetReservesQuery, useAddTokenTransactionMutation, useUpdateTokenTransactionMutation } from "@/redux/features/api/apiSlice"
import { skipToken } from "@reduxjs/toolkit/query"
import { Button } from "@/components/ui/button"
import SubmitItem from "@/components/exchange/SubmitItem"
import TradeItem from "@/components/exchange/TradeItem"
import PopoverConnectWallet from "@/components/wallet/PopoverConnectWallet"
import { swapLiquidityPool } from "@/services/liquiditypool/swapLiquidityPool"
import { HeightIcon } from "@radix-ui/react-icons"
import { ReservePool, Token } from "@/lib/type"
import TokenTransactionWaiting from "@/components/transaction/TokenTransactionWaiting"
import { useGasSwapToken } from "@/hooks/useGas"

export default function SwapBox() { 
    const { isConnected, address } = useAccount()
    const web3 = useWeb3()
    const provider = web3?.provider
    const signer = web3?.signer 
    const { showError } = useToast()
    const { data: allTokens, isFetching: isFetchingToken } = useGetTokensQuery()
    const { data: tokenBalances } = useGetTokenBalancesQuery(address ?? skipToken)
    const { data: reserves } = useGetReservesQuery()
    const [addTokenTransaction] = useAddTokenTransactionMutation()
    const [updateTokenTransaction, { data: updateTransaction, isSuccess: updateSuccess }] = useUpdateTokenTransactionMutation()
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const [tokenOne, setTokenOne] = useState<Token | undefined>(undefined);
    const [tokenTwo, setTokenTwo] = useState<Token | undefined>(undefined);
    const [currentPool, setCurrentPool] = useState<ReservePool | undefined>(undefined);
    const [reserve1, setReserve1] = useState<number>(0)
    const [reserve2, setReserve2] = useState<number>(0)
    const [balance1, setBalance1] = useState<string>("0")
    const [balance2, setBalance2] = useState<string>("0")
    const [amount1, setAmount1] = useState<string>("")
    const [amount2, setAmount2] = useState<string>("")
    const tokens = allTokens?.filter(token => token.symbol !== 'USD')
    const newTokens = tokens?.filter(token => token?.address !== tokenOne?.address && token?.address !== tokenTwo?.address);
    const gas = useGasSwapToken().toString()

    useEffect(() => {
        if (!isFetchingToken && tokens) {
            setTokenOne(tokens[0])
            setTokenTwo(tokens[1])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetchingToken])

    const handleSwitchTokens = () => {
        const one = tokenOne
        const two = tokenTwo
        setTokenOne(two)
        setTokenTwo(one)
        setAmount1(amount2)
    }

    useEffect(() => {
        if (tokenOne && tokenTwo && reserves) {
            const currentPool = reserves.find(pool => [`${tokenOne.symbol}/${tokenTwo.symbol}`, `${tokenTwo.symbol}/${tokenOne.symbol}`].includes(pool?.info.name))
            if (currentPool?.info.token1.address === tokenOne.address) {
                setReserve1(parseFloat(currentPool.reserve1))
                setReserve2(parseFloat(currentPool.reserve2))
            } else {
                setReserve1(parseFloat(currentPool?.reserve2 || '0'))
                setReserve2(parseFloat(currentPool?.reserve1 || '0'))
            }
            setCurrentPool(currentPool)
            setBalance1(tokenBalances?.find(item => item.info.symbol === tokenOne.symbol)?.balance?.formatted || "0")
            setBalance2(tokenBalances?.find(item => item.info.symbol === tokenTwo.symbol)?.balance?.formatted || "0")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenOne, tokenTwo, tokenBalances, reserves])

    useEffect(() => {
        if (amount1 === "") {
            setAmount2("")
            setIsChecked(false)
        } else {
            const value = parseFloat(amount1)
            const amountReceiver = value * reserve2 / (reserve1 + value)
            setAmount2(amountReceiver.toString())
            setIsChecked(parseFloat(balance1) > parseFloat(amount1))
        }
    }, [amount1, reserve1, reserve2, balance1])

    useEffect(() => {
        if (updateTransaction && updateSuccess) {
            setAmount1("")
            setAmount2("")
        }
    }, [updateSuccess, updateTransaction])

    const handleSend = useCallback(async () => {
        if (!!provider && !!signer && !!currentPool && !!address && !!tokenOne && !!tokenTwo && parseFloat(amount1) > 0 && parseFloat(amount2) > 0) {
            const { data: newTransaction } = await addTokenTransaction({
                type: 'Swap Token',
                from_wallet: address,
                to_wallet: currentPool.info.address,
                pool_id: currentPool.pool_id,
                from_token_id: tokenOne._id,
                to_token_id: tokenTwo._id,
                amount_in: amount1,
            })
            try {
                const receipt = await swapLiquidityPool({ provider, signer, address, pool: currentPool, tokenOne, amount: amount1 })
                const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
                if (confirmedReceipt?.status === 1 && newTransaction?._id) {
                    updateTokenTransaction(
                        {
                            _id: newTransaction._id,
                            receipt_hash: receipt.hash,
                        }
                    )
                } else {
                    if (newTransaction?._id) {
                        updateTokenTransaction({
                            _id: newTransaction._id,
                            receipt_hash: "",
                        })
                    }
                }
                console.log(receipt)
            } catch (error) {
                console.error("Transaction error:", error);
                if (newTransaction?._id) {
                    updateTokenTransaction({
                        _id: newTransaction._id,
                        receipt_hash: "",
                    })
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, signer, currentPool, address, tokenOne, tokenTwo, amount1, amount2])

    const handleToast = () => {
        if (!isChecked) {
            showError("Invalid token quantity!")
        }
    }

    return (
        <>
            {!isFetchingToken && newTokens &&
                <div className="flex flex-col w-full h-full">
                    <div className="relative flex flex-col w-full h-full">
                        <TradeItem title="From" token={tokenOne} tokens={newTokens} setToken={setTokenOne} amount={amount1} setAmount={setAmount1} balance={balance1} />
                        <TradeItem title="To" token={tokenTwo} tokens={newTokens} setToken={setTokenTwo} amount={amount2} setAmount={setAmount2} balance={balance2} isDisabled />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-[10%] h-[10%]">
                            <Button onClick={handleSwitchTokens} variant="secondary" className="w-[full] h-full">
                                <HeightIcon className="w-full h-full" />
                            </Button>
                        </div>
                    </div>
                    {isConnected ?
                        <div onClick={handleToast}>
                            {isChecked ?
                                <TokenTransactionWaiting type="Swap Token" handleSend={handleSend} tokenOne={tokenOne} tokenTwo={tokenTwo} address={address} pool={currentPool} value={amount1} gasEth={gas}>
                                    <div className="flex w-full">
                                        <SubmitItem name="Send" isChecked={isChecked} />
                                    </div>
                                </TokenTransactionWaiting>
                                :
                                <div className="flex w-full">
                                    <SubmitItem name="Send" isChecked={isChecked} />
                                </div>
                            }
                        </div>
                        :
                        <PopoverConnectWallet>
                            <div>
                                <SubmitItem name="Connect Wallet" />
                            </div>
                        </PopoverConnectWallet>
                    }
                </div>
            }
        </>
    )
}