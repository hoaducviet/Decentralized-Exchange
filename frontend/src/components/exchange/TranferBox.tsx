'use client'
import Image from "next/image";
import TranferItem from "@/components/exchange/TranferItem";
import DialogItem from "@/components/exchange/DialogItem"
import AddressItem from "@/components/exchange/AddressItem";
import SubmitItem from "@/components/exchange/SubmitItem"
import { Card } from '@/components/ui/card'
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Token } from '@/lib/type'

import tokenETH from "@/assets/token/tokenETH.json";
const eth: Token = tokenETH as Token;
const token = eth

export default function TranferBox() {

    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <TranferItem token={eth} />
            <div className="flex w-full my-[1vh]">
                <Card className="w-full select-none border-none outline-none py-[0.8vh] hover:opacity-50">
                    <DialogItem>
                        <div className="flex flex-row justify-center items-center w-full">
                            <Image src={token.img} alt={token.name} width="48" height="48" className="justify-center" />
                            <div className="flex flex-col justify-center items-start mx-4 w-full h-full">
                                <p className="text-xl font-medium">{token.name}</p>
                                <p>Balance: 0</p>
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