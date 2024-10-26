'use client'
import { useBalances } from "@/hooks/useBalances";
import TokenBalance from "@/components/TokenBalance";
import LiquidityBalance from "@/components/LiquidityBalance";

export default function AddressBalance() {
    const { tokenBalances, liquidBalances, isLoaded } = useBalances()
    const balances = tokenBalances.filter(tokenBalance => tokenBalance.balance?.value !== 0 && tokenBalance.info.symbol !== 'USD')
    const LPbalances = liquidBalances.filter(liquidBalance => liquidBalance.balance?.value !== 0)
    return (
        <>
            {isLoaded &&
                <div className='select-none flex flex-col space-y-[1vw]'>
                    <div className="flex flex-col ">
                        <p className="flex justify-start text-md font-semibold opacity-90 m-[0.4vw]">Tokens balance</p>
                        {balances.map((tokenBalance, index) => {
                            return (
                                <div key={index} className="flex flex-col w-full">
                                    <TokenBalance tokenBalance={tokenBalance} />
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex flex-col border-t border-gray-100 py-[1vw]">
                        <p className="flex justify-start text-md font-semibold opacity-90 m-[0.4vw]">Liquidity pools balance</p>
                        {LPbalances.map((liquidBalance, index) => {
                            return (
                                <div key={index} className="flex flex-col w-full">
                                    <LiquidityBalance liquidityBalance={liquidBalance} />
                                </div>
                            )
                        })
                        }
                    </div>
                </div>
            }
        </>
    )
}