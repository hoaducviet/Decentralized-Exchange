'use client'
import { PoolTransactionsType, Pool, TokenActiveTransaction, LiquidityActiveTransaction } from "@/lib/type";
import { calculateElapsedTime } from "@/utils/calculateElapsedTime";
import { formatNumber } from "@/utils/formatNumber";


const options = ["Time", "Type", "", "", "LPT", "Price", "Wallet"]
interface Props {
    transactions: PoolTransactionsType[];
    pool: Pool | undefined;
}
export default function PoolTransactions({ transactions, pool }: Props) {

    return (
        <div className="flex flex-col text-md font-semibold">
            <div className="bg-secondary/80 hover:bg-secondary flex flex-row justify-between items-center transactions-center h-[3vw] px-3">
                <div className="w-[15%] flex flex-row justify-start">{options[0]}</div>
                <div className="w-[15%] flex flex-row justify-start">{options[1]}</div>
                <div className="w-[10%] flex flex-row justify-end">{pool?.token1?.symbol}</div>
                <div className="w-[15%] flex flex-row justify-end">{pool?.token2?.symbol}</div>
                <div className="w-[15%] flex flex-row justify-end">{options[4]}</div>
                <div className="w-[15%] flex flex-row justify-end">{options[5]}</div>
                <div className="w-[15%] flex flex-row justify-end">{options[6]}</div>
            </div>
            <div className="flex flex-col w-full max-h-[40vw] overflow-x-auto">
                {transactions.map((item, index) => {
                    let transaction: PoolTransactionsType = item
                    if (item.type.includes('Swap')) {
                        transaction = item as TokenActiveTransaction
                        return (
                            <div key={index}>
                                <div className="cursor-pointer flex flex-row justify-between items-center text-md font-semibold hover:bg-secondary/80 h-[3.5vw] px-3">
                                    <div className="w-[15%] flex flex-row justify-start font-medium">{calculateElapsedTime(transaction.createdAt)}</div>
                                    <div className="w-[15%] flex flex-row justify-start">
                                        <div>{transaction.type}</div>
                                    </div>
                                    <div className="w-[10%] flex flex-row justify-end">{transaction.from_token_id?.symbol === pool?.token1_id?.symbol ? transaction.amount_in?.slice(0, transaction.amount_in?.indexOf(".") + 7) : transaction.amount_out?.slice(0, transaction.amount_out?.indexOf(".") + 7)}</div>
                                    <div className="w-[15%] flex flex-row justify-end">{transaction.to_token_id?.symbol === pool?.token1_id?.symbol ? transaction.amount_out?.slice(0, transaction.amount_out?.indexOf(".") + 7) : transaction.amount_in?.slice(0, transaction.amount_in?.indexOf(".") + 7)}</div>
                                    <div className="w-[15%] flex flex-row justify-end">{""}</div>
                                    <div className="w-[15%] flex flex-row justify-end">${formatNumber(parseFloat(transaction.price ?? ""))}</div>
                                    <div className="w-[15%] flex flex-row justify-end">{transaction.from_wallet?.slice(0, 6) + "..." + transaction.from_wallet?.slice(38)}</div>
                                </div>
                            </div>
                        )
                    }
                    transaction = item as LiquidityActiveTransaction
                    return (
                        <div key={index} className="cursor-pointer flex flex-row justify-between items-center text-md font-semibold hover:bg-secondary/80 h-[3.5vw] px-3">
                            <div className="w-[15%] flex flex-row justify-start font-medium">{calculateElapsedTime(transaction.createdAt)}</div>
                            <div className="w-[15%] flex flex-row justify-start">
                                <div>{transaction.type}</div>
                            </div>
                            <div className="w-[10%] flex flex-row justify-end">{transaction.token1_id?.symbol === pool?.token1_id?.symbol ? transaction.amount_token1?.slice(0, transaction.amount_token1?.indexOf(".") + 7) : transaction.amount_token2?.slice(0, transaction.amount_token2?.indexOf(".") + 7)}</div>
                            <div className="w-[15%] flex flex-row justify-end">{transaction.token1_id?.symbol === pool?.token1_id?.symbol ? transaction.amount_token2?.slice(0, transaction.amount_token2?.indexOf(".") + 7) : transaction.amount_token1?.slice(0, transaction.amount_token1?.indexOf(".") + 7)}</div>
                            <div className="w-[15%] flex flex-row justify-end">{transaction.amount_lpt?.slice(0, transaction.amount_lpt?.indexOf(".") + 7) || "0"}</div>
                            <div className="w-[15%] flex flex-row justify-end">${formatNumber(parseFloat(transaction.price ?? ""))}</div>
                            <div className="w-[15%] flex flex-row justify-end">{transaction.wallet?.slice(0, 6) + "..." + transaction.wallet?.slice(38)}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}