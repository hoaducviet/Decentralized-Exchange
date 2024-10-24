'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi';
import { useDispatch } from "react-redux"
import { ethers } from 'ethers';
import { useWeb3 } from '@/hooks/useWeb3';
import { useBalances } from '@/hooks/useBalances'
import { Card } from '@/components/ui/card'
import Image from "next/image";
import { transferToken } from '@/services/liquiditypool/transferToken';
import { resetBalances } from "@/redux/features/balances/balancesSlice"
import TransferItem from "@/components/exchange/TransferItem";
import DialogItem from "@/components/exchange/DialogItem"
import AddressItem from "@/components/exchange/AddressItem";
import SubmitItem from "@/components/exchange/SubmitItem"
import { CaretDownIcon } from "@radix-ui/react-icons";
import { TokenBalancesType } from '@/lib/type'
import { Address } from '@/lib/type';

export default function TransferBox() {
    const { address } = useAccount()
    const dispatch = useDispatch()
    const web3 = useWeb3()
    const provider = web3?.provider
    const signer = web3?.signer
    const { tokenBalances, isLoaded } = useBalances();
    const [tokenOne, setTokenOne] = useState<TokenBalancesType | undefined>(undefined);
    const [amount, setAmount] = useState<string>("")
    const [addressReceiver, setAddressReceiver] = useState<string>("");
    const tokensbalances = tokenBalances.filter(tokenBalance => tokenBalance.info.symbol !== 'USD')

    useEffect(() => {
        if (isLoaded) {
            setTokenOne(tokensbalances[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded])

    const balances = isLoaded ? tokensbalances.filter(tokenBalance => tokenBalance.info.address !== tokenOne?.info.address) : [];
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
                dispatch(resetBalances())
                setAmount("")
                setAddressReceiver("")
            } else {
                console.error("Transaction error:", confirmedReceipt);
            }
            console.log(receipt)
        }
    }, [provider, signer, address, addressReceiver, tokenOne, amount, dispatch])
    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <TransferItem tokenBalance={tokenOne} amount={amount} setAmount={setAmount} />
            <div className="flex w-full my-[1vh]">
                <Card className="w-full select-none border-none outline-none py-[0.8vh] hover:opacity-50">
                    <DialogItem tokenBalances={balances} setToken={setTokenOne}>
                        <div className="flex flex-row justify-center items-center w-full mx-[1vw]">
                            <Image src={tokenOne?.info.img || "/image/default-token.png"} alt={tokenOne?.info.name || "token"} width="48" height="48" className="justify-center" />
                            <div className="flex flex-col justify-center items-start mx-4 w-full h-full">
                                <p className="text-xl font-medium">{tokenOne?.info.name}</p>
                                <p>Balance: {tokenOne?.balance?.formatted}</p>
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
    )
}