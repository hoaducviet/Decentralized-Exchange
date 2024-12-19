'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useWeb3 } from "@/hooks/useWeb3"
import { useToast } from '@/hooks/useToast'
import { useGetTokensQuery, useGetReservesQuery, useAddTokenTransactionMutation, useUpdateTokenTransactionMutation, useGetTokenBalancesQuery } from "@/redux/features/api/apiSlice"
import { swapLiquidityPool } from "@/services/liquiditypool/swapLiquidityPool"
import PopoverConnectWallet from "@/components/wallet/PopoverConnectWallet"
import SubmitItem from "@/components/exchange/SubmitItem"
import SellItem from "@/components/exchange/SellItem"
import { ReservePool, Token } from "@/lib/type"
import { skipToken } from '@reduxjs/toolkit/query'
import TokenTransactionWaiting from '@/components/transaction/TokenTransactionWaiting'
import { useGasSwapToken } from '@/hooks/useGas'

export default function SellBox() {
    const { isConnected, address } = useAccount()
    const web3 = useWeb3()
    const provider = web3?.provider 
    const signer = web3?.signer 
    const { showError } = useToast()
    const { data: tokenBalances } = useGetTokenBalancesQuery(address ?? skipToken)
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const [tokenOne, setTokenOne] = useState<Token | undefined>(undefined);
    const [tokenTwo, setTokenTwo] = useState<Token | undefined>(undefined);
    const [currentPool, setCurrentPool] = useState<ReservePool | undefined>(undefined);
    const [addTokenTransaction] = useAddTokenTransactionMutation()
    const [updateTokenTransaction, { data: updateTransaction, isSuccess: updateSuccess }] = useUpdateTokenTransactionMutation()
    const [reserve1, setReserve1] = useState<number>(0)
    const [reserve2, setReserve2] = useState<number>(0)
    const [balance1, setBalance1] = useState<string>("0")
    const [amount1, setAmount1] = useState<string>("")
    const [amount2, setAmount2] = useState<string>("")
    const { data: allTokens, isFetching: isFetchingToken } = useGetTokensQuery()
    const { data: reserves } = useGetReservesQuery()
    const usdToken = allTokens?.find(token => token.symbol === 'USD')
    const newTokens = allTokens?.filter(token => token.symbol === 'USDT' || token.symbol === 'ETH')
    const optionTokens = newTokens?.filter(token => token.symbol !== tokenOne?.symbol)
    const gas = useGasSwapToken().toString()

    useEffect(() => {
        if (!isFetchingToken && newTokens) {
            setTokenOne(newTokens[0])
            setTokenTwo(usdToken)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetchingToken])

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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenOne, tokenTwo, reserves])

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
    }, [amount1, balance1, reserve1, reserve2])

    useEffect(() => {
        if (updateTransaction && updateSuccess) {
            setAmount1("")
            setAmount2("")
        }
    }, [updateSuccess, updateTransaction])

    const handleSend = useCallback(async () => {
        if (!!provider && !!signer && !!currentPool && !!address && !!tokenOne && !!tokenTwo && parseFloat(amount1) > 0 && parseFloat(amount2) > 0) {
            const { data: newTransaction } = await addTokenTransaction({
                type: "Sell Token",
                from_wallet: address,
                to_wallet: currentPool.info.address,
                pool_id: currentPool.pool_id,
                from_token_id: tokenOne._id,
                to_token_id: tokenTwo._id,
                amount_in: amount1
            })
            try {
                const receipt = await swapLiquidityPool({ provider, signer, address, pool: currentPool, tokenOne, amount: amount1 })
                const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
                if (confirmedReceipt?.status === 1 && newTransaction?._id) {
                    updateTokenTransaction({
                        _id: newTransaction._id,
                        receipt_hash: receipt.hash,
                    })
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
    }, [provider, signer, currentPool, address, tokenOne, amount1, tokenTwo, amount2])

    const handleToast = () => {
        if (!isChecked) {
            showError("Invalid token quantity!")
        }
    }

    return (
        <>
            {!isFetchingToken && optionTokens &&
                <div className="flex flex-col select-none justify-center items-center">
                    <SellItem token={tokenOne} tokens={optionTokens} setToken={setTokenOne} setAmount={setAmount1} amount1={amount1} amount2={amount2} />
                    {isConnected ?
                        <div onClick={handleToast} className='flex w-full'>
                            {isChecked ?
                                <TokenTransactionWaiting type="Sell Token" handleSend={handleSend} tokenOne={tokenOne} tokenTwo={tokenTwo} address={address} pool={currentPool} value={amount1} gasEth={gas}>
                                    <div className='flex w-full'>
                                        <SubmitItem name="Sell" isChecked={isChecked} />
                                    </div>
                                </TokenTransactionWaiting>
                                :
                                <div className='flex w-full'>
                                    <SubmitItem name="Sell" isChecked={isChecked} />
                                </div>
                            }
                        </div>
                        :
                        <PopoverConnectWallet>
                            <div className='flex w-full'>
                                <SubmitItem name="Connect Wallet" />
                            </div>
                        </PopoverConnectWallet>
                    }
                </div>
            }
        </>
    )
}