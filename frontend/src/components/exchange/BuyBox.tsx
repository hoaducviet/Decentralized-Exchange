'use client'

import SubmitItem from "@/components/exchange/SubmitItem"
import BuyItem from "@/components/exchange/BuyItem"
import tokenETH from "@/assets/token/tokenETH.json";
import { type Token } from '@/lib/type';

const eth: Token = tokenETH as Token;

export default function BuyBox() {

    return (
        <div className="flex flex-col justify-center items-center">
            <BuyItem token={eth}/>
            <SubmitItem name="Buy" />
        </div>
    )
}