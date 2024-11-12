'use client'
import { LiquidityActiveTransaction, Pool } from "@/lib/type";


const options = ["Time", "Type", "", "", "LPT", "Price", "Wallet"]
interface Props {
    transactions: LiquidityActiveTransaction[];
}
export default function PoolTransactions({ transactions }: Props) {
    const pool = transactions[0]?.pool_id as Pool;

    return (
        <div className="flex flex-col text-md font-semibold">
            <div className="bg-secondary/80 hover:bg-secondary flex flex-row justify-between items-center h-[3vw] px-3">
                <div className="w-[15%] flex flex-row justify-start">{options[0]}</div>
                <div className="w-[15%] flex flex-row justify-start">{options[1]}</div>
                <div className="w-[10%] flex flex-row justify-end">{pool.token1_id?.symbol}</div>
                <div className="w-[15%] flex flex-row justify-end">{pool.token2_id?.symbol}</div>
                <div className="w-[15%] flex flex-row justify-end">{options[4]}</div>
                <div className="w-[15%] flex flex-row justify-end">{options[5]}</div>
                <div className="w-[15%] flex flex-row justify-end">{options[6]}</div>
            </div>
            <div className="flex flex-col w-full max-h-[40vw] overflow-x-auto">
                {transactions.map((item, index) => {
                    return (
                        <div key={index} className="cursor-pointer flex flex-row justify-between items-center text-md font-semibold hover:bg-secondary/80 h-[3.5vw] px-3">
                            <div className="w-[15%] flex flex-row justify-start font-medium">{item.createdAt}</div>
                            <div className="w-[15%] flex flex-row justify-start">
                                <div>{item.type}</div>
                            </div>
                            <div className="w-[10%] flex flex-row justify-end">{item.token1_id.symbol === pool.token1_id?.symbol ? item.amount_token1?.slice(0, item.amount_token1?.indexOf(".") + 7) : item.amount_token2?.slice(0, item.amount_token2?.indexOf(".") + 7)}</div>
                            <div className="w-[15%] flex flex-row justify-end">{item.token1_id.symbol === pool.token1_id?.symbol ? item.amount_token2?.slice(0, item.amount_token2?.indexOf(".") + 7) : item.amount_token1?.slice(0, item.amount_token1?.indexOf(".") + 7)}</div>
                            <div className="w-[15%] flex flex-row justify-end">{item.amount_lpt?.slice(0, item.amount_lpt?.indexOf(".") + 7) || "0"}</div>
                            <div className="w-[15%] flex flex-row justify-end">$ {item.price || "0"}</div>
                            <div className="w-[15%] flex flex-row justify-end">{item.wallet.slice(0, 6) + "..." + item.wallet.slice(38)}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}