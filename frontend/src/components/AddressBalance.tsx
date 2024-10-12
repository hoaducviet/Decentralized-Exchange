'use client'
import { useAccount } from "wagmi";
import TokenBalance from "@/components/TokenBalance";
import tokenList from "@/assets/token/tokenList.json";
import tokenETH from "@/assets/token/tokenETH.json";
import { Token } from '@/lib/type'
const tokens: Token[] = tokenList as Token[];
const eth: Token = tokenETH as Token;

export default function AddressBalance() {
    const { address, isConnected } = useAccount()
    return (
        <div className='flex flex-col w-full'>
            <div className="flex flex-col w-full">
                <TokenBalance address={address} token={eth} isETH />
            </div>
            {isConnected && tokens.map((token, index) => {
                return (
                    <div key={index} className="flex flex-col w-full">
                        <TokenBalance address={address} token={token} />
                    </div>
                )
            })}
        </div>
    )
}