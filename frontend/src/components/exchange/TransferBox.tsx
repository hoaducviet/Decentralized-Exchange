'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { useWeb3 } from '@/hooks/useWeb3';
import { Card } from '@/components/ui/card'
import Image from "next/image";
import { transferToken } from '@/services/liquiditypool/transferToken';
import TransferItem from "@/components/exchange/TransferItem";
import DialogItem from "@/components/exchange/DialogItem"
import AddressItem from "@/components/exchange/AddressItem";
import SubmitItem from "@/components/exchange/SubmitItem"
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Token } from '@/lib/type'
import { Address } from '@/lib/type';
import { useGetTokenBalancesQuery, useGetTokensQuery } from '@/redux/features/api/apiSlice';
import { skipToken } from '@reduxjs/toolkit/query';

export default function TransferBox() {
    const { address } = useAccount()
    const web3 = useWeb3()
    const provider = web3?.provider
    const signer = web3?.signer
    const { data: tokens, isFetching: isFetchingToken } = useGetTokensQuery()
    const { data: tokenBalances } = useGetTokenBalancesQuery(address ?? skipToken)
    const [tokenOne, setTokenOne] = useState<Token | undefined>(undefined);
    const [balance, setBalance] = useState<string>("0")
    const [amount, setAmount] = useState<string>("")
    const [addressReceiver, setAddressReceiver] = useState<string>("");
    const newTokens = tokens?.filter(token => token.symbol !== 'USD' && token.symbol !== tokenOne?.symbol);

    useEffect(() => {
        if (!isFetchingToken && newTokens) {
            setTokenOne(newTokens[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetchingToken])

    useEffect(() => {
        if (tokenOne) {
            setBalance(tokenBalances?.find(item => item.info.symbol === tokenOne.symbol)?.balance?.formatted || "0")
        }
    }, [tokenOne, tokenBalances])

    const handleSend = useCallback(async () => {
        if (!ethers.isAddress(addressReceiver)) {
            console.log("Address incorrect")
            return
        }
        if (!!provider && !!signer && !!address && !!addressReceiver && !!tokenOne && parseFloat(amount) > 0) {
            const addressTo: Address = addressReceiver as Address
            const receipt = await transferToken({ provider, signer, address, addressTo, token: tokenOne, amount });
            const confirmedReceipt = await signer.provider.waitForTransaction(receipt.hash);
            if (confirmedReceipt?.status === 1) {
                setAmount("")
                setAddressReceiver("")
            } else {
                console.error("Transaction error:", confirmedReceipt);
            }
            console.log(receipt)
        }
    }, [provider, signer, address, addressReceiver, tokenOne, amount])
    return (
        <>
            {!isFetchingToken && newTokens &&
                <div className="flex flex-col justify-center items-center w-full h-full">
                    <TransferItem token={tokenOne} amount={amount} setAmount={setAmount} />
                    <div className="flex w-full my-[1vh]">
                        <Card className="w-full select-none border-none outline-none py-[0.8vh] hover:opacity-50">
                            <DialogItem tokens={newTokens} setToken={setTokenOne}>
                                <div className="flex flex-row justify-center items-center w-full mx-[1vw]">
                                    <Image src={tokenOne?.img || "/image/default-token.png"} alt={tokenOne?.name || "token"} width="48" height="48" className="justify-center" />
                                    <div className="flex flex-col justify-center items-start mx-4 w-full h-full">
                                        <p className="text-xl font-medium">{tokenOne?.name}</p>
                                        {address && <p>Balance: {balance}</p>}
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