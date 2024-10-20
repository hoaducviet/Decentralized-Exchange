'use client'
import { useState, useEffect } from 'react'
import Image from "next/image";
import TranferItem from "@/components/exchange/TranferItem";
import DialogItem from "@/components/exchange/DialogItem"
import AddressItem from "@/components/exchange/AddressItem";
import SubmitItem from "@/components/exchange/SubmitItem"
import { Card } from '@/components/ui/card'
import { CaretDownIcon } from "@radix-ui/react-icons";
import { useBalances } from '@/hooks/useBalances'
import { BalancesType } from '@/lib/type'


export default function TranferBox() {
    const { balances, isLoaded } = useBalances();
    const [tokenOne, setTokenOne] = useState<BalancesType | undefined>(undefined);

    useEffect(() => {
        if (isLoaded) {
            setTokenOne(balances[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded])
    const tokenBalances = isLoaded ? balances.filter(tokenBalance => tokenBalance.token.address !== tokenOne?.token.address) : [];

    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <TranferItem tokenBalance={tokenOne} />
            <div className="flex w-full my-[1vh]">
                <Card className="w-full select-none border-none outline-none py-[0.8vh] hover:opacity-50">
                    <DialogItem tokenBalances={tokenBalances} setToken={setTokenOne}>
                        <div className="flex flex-row justify-center items-center w-full mx-[1vw]">
                            <Image src={tokenOne?.token.img || "/image/default-token.png"} alt={tokenOne?.token.name || "token"} width="48" height="48" className="justify-center" />
                            <div className="flex flex-col justify-center items-start mx-4 w-full h-full">
                                <p className="text-xl font-medium">{tokenOne?.token.name}</p>
                                <p>Balance: {tokenOne?.balance?.formatted}</p>
                            </div>
                            <CaretDownIcon width={36} height={36} />
                        </div>
                    </DialogItem>
                </Card>
            </div>
            <AddressItem />
            <SubmitItem name="Tranfer" />
        </div>
    )
}