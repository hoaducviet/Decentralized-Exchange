'use client'
import { PoolTransactionsType, Pool, TokenActiveTransaction, LiquidityActiveTransaction } from "@/lib/type";
import { calculateElapsedTime } from "@/utils/calculateElapsedTime";
import { formatPrice } from "@/utils/formatPrice";
import { Card } from "@/components/ui/card"


const options = ["Time", "Type", "", "", "LPT", "Price", "Wallet"]
interface Props {
    transactions: PoolTransactionsType[];
    pool: Pool | undefined;
}
export default function PoolTransactions({ transactions, pool }: Props) {
 
    return (
        <Card className="flex flex-col w-full rounded-2xl border-[1px] shadow-md">
            <div className="bg-secondary/80 hover:bg-secondary flex flex-row justify-between items-center text-md font-semibold rounded-t-2xl h-[3vw] px-4">
                <div className="w-[15%] flex flex-row justify-start">{options[0]}</div>
                <div className="w-[15%] flex flex-row justify-start">{options[1]}</div>
                <div className="w-[10%] flex flex-row justify-end">{pool?.token1?.symbol}</div>
                <div className="w-[15%] flex flex-row justify-end">{pool?.token2?.symbol}</div>
                <div className="w-[15%] flex flex-row justify-end">{options[4]}</div>
                <div className="w-[15%] flex flex-row justify-end">{options[5]}</div>
                <div className="w-[15%] flex flex-row justify-end">{options[6]}</div>
            </div>
            <div className="flex flex-col w-full max-h-[55vw] overflow-x-auto">
                {transactions.map((item, index) => {
                    let transaction: PoolTransactionsType = item
                    if (item.type.includes('Swap')) {
                        transaction = item as TokenActiveTransaction
                        return (
                            <div key={index}>
                                <div className={`flex flex-row cursor-pointer hover:bg-secondary/80 dark:hover:bg-white/5 text-md font-medium items-center h-[3.5vw] w-full px-4 border-t-[0.2px] border-gray-300 border-opacity-20 ${index === transactions.length - 1 ? 'rounded-b-2xl' : ''}`} >
                                    <div className="w-[15%] flex flex-row justify-start font-medium">{calculateElapsedTime(transaction.createdAt)}</div>
                                    <div className="w-[15%] flex flex-row justify-start">
                                        <div>{transaction.type}</div>
                                    </div>
                                    <div className="w-[10%] flex flex-row justify-end">{transaction.from_token_id?.symbol === pool?.token1_id?.symbol ? transaction.amount_in?.slice(0, transaction.amount_in?.indexOf(".") + 7) : transaction.amount_out?.slice(0, transaction.amount_out?.indexOf(".") + 7)}</div>
                                    <div className="w-[15%] flex flex-row justify-end">{transaction.to_token_id?.symbol === pool?.token1_id?.symbol ? transaction.amount_out?.slice(0, transaction.amount_out?.indexOf(".") + 7) : transaction.amount_in?.slice(0, transaction.amount_in?.indexOf(".") + 7)}</div>
                                    <div className="w-[15%] flex flex-row justify-end">{""}</div>
                                    <div className="w-[15%] flex flex-row justify-end">${formatPrice(parseFloat(transaction.price ?? ""))}</div>
                                    <div className="w-[15%] flex flex-row justify-end">{transaction.from_wallet?.slice(0, 6) + "..." + transaction.from_wallet?.slice(38)}</div>
                                </div>
                            </div>
                        )
                    }
                    transaction = item as LiquidityActiveTransaction
                    return (
                        <div key={index}>
                            <div className="cursor-pointer flex flex-row justify-between items-center text-md hover:bg-secondary/80 h-[3.5vw] px-3">
                                <div className="w-[15%] flex flex-row justify-start font-medium">{calculateElapsedTime(transaction.createdAt)}</div>
                                <div className="w-[15%] flex flex-row justify-start">
                                    <div>{transaction.type}</div>
                                </div>
                                <div className="w-[10%] flex flex-row justify-end">{transaction.token1_id?.symbol === pool?.token1_id?.symbol ? transaction.amount_token1?.slice(0, transaction.amount_token1?.indexOf(".") + 7) : transaction.amount_token2?.slice(0, transaction.amount_token2?.indexOf(".") + 7)}</div>
                                <div className="w-[15%] flex flex-row justify-end">{transaction.token1_id?.symbol === pool?.token1_id?.symbol ? transaction.amount_token2?.slice(0, transaction.amount_token2?.indexOf(".") + 7) : transaction.amount_token1?.slice(0, transaction.amount_token1?.indexOf(".") + 7)}</div>
                                <div className="w-[15%] flex flex-row justify-end">{formatPrice(parseFloat(transaction.amount_lpt ?? ""))}</div>
                                <div className="w-[15%] flex flex-row justify-end">${formatPrice(parseFloat(transaction.price ?? ""))}</div>
                                <div className="w-[15%] flex flex-row justify-end">{transaction.wallet?.slice(0, 6) + "..." + transaction.wallet?.slice(38)}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}