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
        <div className='select-none flex flex-col w-full'>
            <p className="flex justify-start text-md font-semibold opacity-90 m-[0.4vw]">Tokens balance</p>
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