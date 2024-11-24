'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useWeb3 } from "@/hooks/useWeb3"
import { useGetTokensQuery, useGetReservesQuery, useAddTokenTransactionMutation, useUpdateTokenTransactionMutation } from "@/redux/features/api/apiSlice"
import { swapLiquidityPool } from "@/services/liquiditypool/swapLiquidityPool"
import SubmitItem from "@/components/exchange/SubmitItem"
import BuyItem from "@/components/exchange/BuyItem"
import { ReservePool, Token } from "@/lib/type"

export default function BuyBox() {
    const { address } = useAccount()
    const web3 = useWeb3()
    const provider = web3?.provider
    const signer = web3?.signer
    const [tokenOne, setTokenOne] = useState<Token | undefined>(undefined);
    const [tokenTwo, setTokenTwo] = useState<Token | undefined>(undefined);
    const [currentPool, setCurrentPool] = useState<ReservePool | undefined>(undefined);
    const [addTokenTransaction] = useAddTokenTransactionMutation()
    const [updateTokenTransaction, { data: updateTransaction, isSuccess: updateSuccess }] = useUpdateTokenTransactionMutation()
    const [reserve1, setReserve1] = useState<number>(0)
    const [reserve2, setReserve2] = useState<number>(0)
    const [amount1, setAmount1] = useState<string>("")
    const [amount2, setAmount2] = useState<string>("")
    const { data: allTokens, isFetching: isFetchingToken } = useGetTokensQuery()
    const { data: reserves } = useGetReservesQuery()
    const usdToken = allTokens?.find(token => token.symbol === 'USD')
    const newTokens = allTokens?.filter(token => token.symbol === 'USDT' || token.symbol === 'ETH')
    const optionTokens = newTokens?.filter(token => token.symbol !== tokenOne?.symbol)

    useEffect(() => {
        if (!isFetchingToken && newTokens) {
            setTokenOne(usdToken)
            setTokenTwo(newTokens[0])
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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenOne, tokenTwo, reserves])

    useEffect(() => {
        if (amount1 === "") {
            setAmount2("")
        } else {
            const value = parseFloat(amount1)
            const amountReceiver = value * reserve2 / (reserve1 + value)
            setAmount2(amountReceiver.toString())
        }
    }, [amount1, reserve1, reserve2])

    useEffect(() => {
        if (updateTransaction && updateSuccess) {
            setAmount1("")
            setAmount2("")
        }
    }, [updateSuccess, updateTransaction])

    const handleSend = useCallback(async () => {
        if (!!provider && !!signer && !!currentPool && !!address && !!tokenOne && !!tokenTwo && parseFloat(amount1) > 0 && parseFloat(amount2) > 0) {
            const { data: newTransaction } = await addTokenTransaction({
                type: "Buy Token",
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
    }, [provider, signer, currentPool, address, tokenOne, amount1, tokenTwo, amount2, reserve1, reserve2])

    return (
        <>
            {!isFetchingToken && optionTokens &&
                <div className="flex flex-col justify-center items-center">
                    <BuyItem token={tokenTwo} tokens={optionTokens} setToken={setTokenTwo} setAmount={setAmount1} amount1={amount1} amount2={amount2} />
                    <div onClick={handleSend} className='flex w-full'>
                        <SubmitItem name="Buy" />
                    </div>
                </div>
            }
        </>
    )
}