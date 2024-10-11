'use client'

import SubmitItem from "@/components/exchange/SubmitItem"
import SellItem from "@/components/exchange/SellItem"
import tokenETH from "@/assets/token/tokenETH.json";
import { type Token } from '@/lib/type';

const eth: Token = tokenETH as Token;

export default function SellBox() {

    return (
        <div className="flex flex-col select-none justify-center items-center">
            <SellItem token={eth}/>
            <SubmitItem name="Sell" />
        </div>
    )
}