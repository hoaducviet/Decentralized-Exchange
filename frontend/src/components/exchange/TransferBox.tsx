'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi';
import { ethers, formatEther } from 'ethers';
import { useWeb3 } from '@/hooks/useWeb3';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetTokenBalancesQuery, useGetTokensQuery, useGetReservePoolQuery, useAddTokenTransactionMutation, useUpdateTokenTransactionMutation } from "@/redux/features/api/apiSlice"
import { Card } from '@/components/ui/card'
import { transferToken } from '@/services/liquiditypool/transferToken';
import Image from "next/image";
import TransferItem from "@/components/exchange/TransferItem";
import DialogItem from "@/components/exchange/DialogItem"
import AddressItem from "@/components/exchange/AddressItem";
import SubmitItem from "@/components/exchange/SubmitItem"
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Token, Address } from '@/lib/type'

export default function TransferBox() {
    const { address } = useAccount()
    const web3 = useWeb3()
    const provider = web3?.provider
    const signer = web3?.signer
    const { data: tokens, isFetching: isFetchingToken } = useGetTokensQuery()
    const { data: tokenBalances } = useGetTokenBalancesQuery(address ?? skipToken)
    const { data: reservePools } = useGetReservePoolQuery()
    const [addTokenTransaction] = useAddTokenTransactionMutation()
    const [updateTokenTransaction, { data: updateTransaction, isSuccess: updateSuccess }] = useUpdateTokenTransactionMutation()
    const [tokenOne, setTokenOne] = useState<Token | undefined>(undefined);
    const [tokenTwo, setTokenTwo] = useState<Token | undefined>(undefined);
    const [reserve1, setReserve1] = useState<number>(0)
    const [reserve2, setReserve2] = useState<number>(0)
    const [balance1, setBalance1] = useState<string>("0")
    const [balance2, setBalance2] = useState<string>("0")
    const [amount1, setAmount1] = useState<string>("")
    const [amount2, setAmount2] = useState<string>("")
    const [addressReceiver, setAddressReceiver] = useState<string>("");
    const usdToken = tokens?.find(token => token.symbol === 'USD')
    const newTokens = tokens?.filter(token => token.symbol !== tokenOne?.symbol && token.symbol !== tokenTwo?.symbol);

    useEffect(() => {
        if (!isFetchingToken && newTokens) {
            setTokenOne(newTokens[0])
            setTokenTwo(usdToken)
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
        if (tokenOne && tokenTwo && reservePools) {
            const currentPool = reservePools.find(pool => [`${tokenOne.symbol}/${tokenTwo.symbol}`, `${tokenTwo.symbol}/${tokenOne.symbol}`].includes(pool.info.name))
            if (currentPool?.info.token1.address === tokenOne.address) {
                setReserve1(Number(currentPool.reserve1))
                setReserve2(Number(currentPool.reserve2))
            } else {
                setReserve1(Number(currentPool?.reserve2))
                setReserve2(Number(currentPool?.reserve1))
            }
            setBalance1(tokenBalances?.find(item => item.info.symbol === tokenOne.symbol)?.balance?.formatted || "0")
            setBalance2(tokenBalances?.find(item => item.info.symbol === tokenTwo.symbol)?.balance?.formatted || "0")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenOne, tokenTwo, tokenBalances, reservePools])

    useEffect(() => {
        if (amount1 === "") {
            setAmount2("")
            return
        }
        if (!!tokenOne && !!tokenTwo && reservePools) {
            const value = parseFloat(amount1)
            if (['USD', 'USDT', 'ETH'].includes(tokenOne.symbol) && ['USD', 'USDT', 'ETH'].includes(tokenTwo.symbol)) {
                const amountReceiver = value * reserve2 / reserve1
                setAmount2(amountReceiver.toString())
                return
            } else {
                if (tokenOne.symbol !== 'USD') {
                    const tokenPool = reservePools.find(pool => [`${tokenOne.symbol}/USDT`, `USDT/${tokenOne.symbol}`].includes(pool.info.name))
                    const usdPool = reservePools.find(pool => ['USD/USDT', 'USD/USDT'].includes(pool.info.name))
                    const [tokenReserve1, tokenReserve2] = tokenPool?.info.name.startsWith("USDT/") ? [Number(tokenPool?.reserve1), Number(tokenPool?.reserve2)] : [Number(tokenPool?.reserve2), Number(tokenPool?.reserve1)]
                    const [usdReserve1, usdReserve2] = usdPool?.info.name.startsWith("USDT/") ? [Number(usdPool?.reserve1), Number(usdPool?.reserve2)] : [Number(usdPool?.reserve2), Number(usdPool?.reserve1)]
                    const amountReceiver = value * (tokenReserve1 / tokenReserve2) * (usdReserve2 / usdReserve1)
                    setAmount2(amountReceiver.toString())
                    return
                } else {
                    const tokenPool = reservePools.find(pool => [`${tokenTwo.symbol}/USDT`, `USDT/${tokenTwo.symbol}`].includes(pool.info.name))
                    const usdPool = reservePools.find(pool => ['USD/USDT', 'USD/USDT'].includes(pool.info.name))
                    const [tokenReserve1, tokenReserve2] = tokenPool?.info.name.startsWith("USDT/") ? [Number(tokenPool?.reserve1), Number(tokenPool?.reserve2)] : [Number(tokenPool?.reserve2), Number(tokenPool?.reserve1)]
                    const [usdReserve1, usdReserve2] = usdPool?.info.name.startsWith("USDT/") ? [Number(usdPool?.reserve1), Number(usdPool?.reserve2)] : [Number(usdPool?.reserve2), Number(usdPool?.reserve1)]
                    const amountReceiver = value * (tokenReserve2 / tokenReserve1) * (usdReserve1 / usdReserve2)
                    setAmount2(amountReceiver.toString())
                    return
                }
            }
        }
    }, [amount1, reserve1, reserve2, tokenOne, tokenTwo, reservePools])

    useEffect(() => {
        if (updateTransaction && updateSuccess) {
            setAmount1("")
            setAmount2("")
        }
    }, [updateSuccess, updateTransaction])

    const handleSend = useCallback(async () => {
        if (!ethers.isAddress(addressReceiver)) {
            console.log("Address incorrect")
            return
        }
        if (!!provider && !!signer && !!address && !!addressReceiver && !!tokenOne && !!tokenTwo && parseFloat(amount1) > 0 && parseFloat(amount2) > 0) {
            const addressTo: Address = addressReceiver as Address
            const { data: newTransaction } = await addTokenTransaction({
                type: "Transfer Token",
                from_wallet: address,
                to_wallet: addressTo,
                from_token_id: tokenOne.symbol === 'USD' ? tokenTwo._id : tokenOne._id,
                amount_in: tokenOne.symbol === 'USD' ? amount2 : amount1
            })
            try {
                const receipt = await transferToken({ provider, signer, address, addressTo, token: (tokenOne.symbol === 'USD' ? tokenTwo : tokenOne), amount: (tokenOne.symbol === 'USD' ? amount2 : amount1) });
                const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
                if (confirmedReceipt?.status === 1 && newTransaction?._id) {
                    updateTokenTransaction({
                        id: newTransaction._id,
                        data: {
                            price: (reserve1 / reserve2).toString(),
                            gas_fee: formatEther(confirmedReceipt.gasPrice * confirmedReceipt.gasUsed),
                            receipt_hash: receipt.hash,
                            status: 'Completed'
                        }
                    })
                } else {
                    if (newTransaction?._id) {
                        updateTokenTransaction({
                            id: newTransaction._id,
                            data: {
                                status: 'Failed'
                            }
                        })
                        console.error("Transaction error:", confirmedReceipt);
                    }
                }
                console.log(receipt)
            } catch (error) {
                console.error("Transaction error:", error);
                if (newTransaction?._id) {
                    updateTokenTransaction({
                        id: newTransaction._id,
                        data: {
                            status: 'Failed'
                        }
                    })
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, signer, address, addressReceiver, tokenOne, tokenTwo, amount1, amount2])
    return (
        <>
            {!isFetchingToken && newTokens &&
                <div className="flex flex-col justify-center items-center w-full h-full">
                    <TransferItem token1={tokenOne} token2={tokenTwo} amount1={amount1} amount2={amount2} setAmount={setAmount1} handleSwitchTokens={handleSwitchTokens} />
                    <div className="flex w-full my-[1vh]">
                        <Card className="w-full select-none border-none outline-none py-[0.8vh] hover:opacity-50">
                            <DialogItem tokens={newTokens} setToken={setTokenOne}>
                                <div className="flex flex-row justify-center items-center w-full mx-[1vw]">
                                    <Image src={(tokenOne?.symbol === 'USD' ? tokenTwo?.img : tokenOne?.img) || "/image/default-token.png"} alt={(tokenOne?.symbol === 'USD' ? tokenTwo?.name : tokenOne?.name) || "token"} width="48" height="48" className="justify-center" />
                                    <div className="flex flex-col justify-center items-start mx-4 w-full h-full">
                                        <p className="text-xl font-medium">{(tokenOne?.symbol === 'USD' ? tokenTwo?.name : tokenOne?.name)}</p>
                                        {address && <p>Balance: {tokenOne?.symbol === 'USD' ? balance2 : balance1}</p>}
                                    </div>
                                    <CaretDownIcon width={36} height={36} />
                                </div>
                            </DialogItem>
                        </Card>
                    </div>
                    <AddressItem address={addressReceiver} setAddress={setAddressReceiver} />
                    <div onClick={handleSend} className='flex w-full'>
                        <SubmitItem name="Tranfer" />
                    </div>
                </div>
            }
        </>
    )
}