'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/useToast'
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetTokenBalancesQuery, useGetTokensQuery, useAddTokenTransactionMutation, useUpdateTokenTransactionMutation } from "@/redux/features/api/apiSlice"
import { Card } from '@/components/ui/card'
import { transferToken } from '@/services/liquiditypool/transferToken';
import PopoverConnectWallet from "@/components/wallet/PopoverConnectWallet"
import Image from "next/image";
import TransferItem from "@/components/exchange/TransferItem";
import DialogItem from "@/components/exchange/DialogItem"
import AddressItem from "@/components/exchange/AddressItem";
import SubmitItem from "@/components/exchange/SubmitItem"
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Token, Address } from '@/lib/type'
import TokenTransactionWaiting from '@/components/transaction/TokenTransactionWaiting';
import { useGasTransferToken } from '@/hooks/useGas' 

export default function TransferBox() {
    const { isConnected, address } = useAccount()
    const web3 = useWeb3()
    const provider = web3?.provider
    const signer = web3?.signer
    const { showError } = useToast()
    const { data: tokens, isFetching: isFetchingToken } = useGetTokensQuery()
    const { data: tokenBalances } = useGetTokenBalancesQuery(address ?? skipToken)
    const [addTokenTransaction] = useAddTokenTransactionMutation()
    const [updateTokenTransaction, { data: updateTransaction, isSuccess: updateSuccess }] = useUpdateTokenTransactionMutation()
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const [tokenOne, setTokenOne] = useState<Token | undefined>(undefined);
    const [tokenTwo, setTokenTwo] = useState<Token | undefined>(undefined);
    const [balance1, setBalance1] = useState<string>("0")
    const [balance2, setBalance2] = useState<string>("0")
    const [amount1, setAmount1] = useState<string>("")
    const [amount2, setAmount2] = useState<string>("")
    const [addressReceiver, setAddressReceiver] = useState<string>("");
    const usdToken = tokens?.find(token => token.symbol === 'USD')
    const newTokens = tokens?.filter(token => token.symbol !== tokenOne?.symbol && token.symbol !== tokenTwo?.symbol && token.symbol !== "USD");
    const gas = useGasTransferToken().toString()

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
        if (tokenOne && tokenTwo) {
            setBalance1(tokenBalances?.find(item => item.info.symbol === tokenOne.symbol)?.balance?.formatted || "0")
            setBalance2(tokenBalances?.find(item => item.info.symbol === tokenTwo.symbol)?.balance?.formatted || "0")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenOne, tokenTwo, tokenBalances])

    useEffect(() => {
        if (amount1 === "") {
            setAmount2("")
            setIsChecked(false)
            return
        }
        if (!!tokenOne && !!tokenTwo) {
            const value = parseFloat(amount1)
            if (tokenOne.symbol !== 'USD') {
                const amountUsd = value * parseFloat(tokenOne.price)
                setAmount2(amountUsd.toString())
                setIsChecked(parseFloat(balance1) > parseFloat(amount1) && ethers.isAddress(addressReceiver))
                return
            } else {
                const amountToken = value * (1 / parseFloat(tokenTwo.price))
                setAmount2(amountToken.toString())
                setIsChecked(parseFloat(balance2) > amountToken && ethers.isAddress(addressReceiver))
                return
            }
        }
    }, [amount1, balance1, balance2, tokenOne, tokenTwo, addressReceiver])

    useEffect(() => {
        if (updateTransaction && updateSuccess) {
            setAmount1("")
            setAmount2("")
        }
    }, [updateSuccess, updateTransaction])

    const handleSend = useCallback(async () => {
        if (!ethers.isAddress(addressReceiver)) {
            showError("Address incorrect")
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
    }, [provider, signer, address, addressReceiver, tokenOne, tokenTwo, amount1, amount2])

    const handleToast = () => {
        if (!isChecked) {
            showError("Invalid token quantity!")
        }
        if (!ethers.isAddress(addressReceiver)) {
            showError("Invalid address receiver!")
        }
    }

    return (
        <>
            {!isFetchingToken && newTokens &&
                <div className="flex flex-col justify-center items-center w-full h-full">
                    <TransferItem token1={tokenOne} token2={tokenTwo} amount1={amount1} amount2={amount2} setAmount={setAmount1} handleSwitchTokens={handleSwitchTokens} />
                    <div className="flex w-full my-[1vh]">
                        <Card className="w-full select-none border-none outline-none py-[0.8vh] hover:opacity-50">
                            <DialogItem tokens={newTokens} setToken={tokenOne?.symbol === 'USD' ? setTokenTwo : setTokenOne}>
                                <div className="flex flex-row justify-center items-center w-full mx-[1vw]">
                                    <Image src={(tokenOne?.symbol === 'USD' ? tokenTwo?.img : tokenOne?.img) || "/image/default-token.png"} priority={true} alt={(tokenOne?.symbol === 'USD' ? tokenTwo?.name : tokenOne?.name) || "token"} width="48" height="48" className="justify-center" />
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

                    {isConnected ?
                        <div onClick={handleToast} className='flex w-full'>
                            {isChecked && ethers.isAddress(addressReceiver) ?
                                <TokenTransactionWaiting type="Transfer Token" handleSend={handleSend} tokenOne={tokenOne?.symbol === "USD" ? tokenTwo : tokenOne} address={address} value={tokenOne?.symbol === "USD" ? amount2 : amount1} gasEth={gas} addressReceiver={addressReceiver as Address}>
                                    <div className='flex w-full'>
                                        <SubmitItem name="Tranfer" isChecked={isChecked} />
                                    </div>
                                </TokenTransactionWaiting>
                                :
                                <div className='flex w-full'>
                                    <SubmitItem name="Transfer" isChecked={isChecked} />
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