'use client'
import { calculateElapsedTime } from "@/utils/calculateElapsedTime"
import { Card } from "@/components/ui/card"
import { TokenActiveTransaction } from "@/lib/type";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { formatPrice } from "@/utils/formatPrice";

interface Props {
    transactions: TokenActiveTransaction[];
    symbol: string;
}

const headers = ["Time", "Type", "From", "To", "USD", "Wallet"]
export default function TokenTransactions({ transactions, symbol }: Props) {
 
    return (
        <Card className="flex flex-col w-full rounded-2xl border-[1px] shadow-md">
            <div className="bg-secondary/80 hover:bg-secondary flex flex-row justify-between items-center text-md font-semibold rounded-t-2xl h-[3vw] px-4">
                <div className="flex flex-row justify-start items-center w-[15vw]">{headers[0]}</div>
                <div className="flex flex-row justify-start items-center w-[15vw]">{headers[1]}</div>
                <div className="flex flex-row justify-start items-center w-[20vw]">{headers[2]}</div>
                <div className="flex flex-row justify-start items-center w-[20vw]">{headers[3]}</div>
                <div className="flex flex-row justify-start items-center w-[15vw]">{headers[4]}</div>
                <div className="flex flex-row justify-end items-center w-[15vw]">{headers[5]}</div>
            </div>
            <div className="flex flex-col max-h-[55vw] overflow-x-auto">
                {transactions.length ? <> {transactions.map((transaction, index) => {
                    const [token1, token2] = transaction.from_token_id.symbol === "ETH" ? [transaction.from_token_id, transaction.to_token_id] : [transaction.to_token_id, transaction.from_token_id]
                    const [amount1, amount2] = transaction.from_token_id.symbol === "ETH" ? [transaction.amount_in, transaction.amount_out] : [transaction.amount_out, transaction.amount_in]
                    return (
                        <div key={index}>
                            <div className={`flex flex-row cursor-pointer hover:bg-secondary/80 dark:hover:bg-white/5 text-md font-medium items-center h-[3.5vw] w-full px-4 border-t-[0.2px] border-gray-300 border-opacity-20 ${index === transactions.length - 1 ? 'rounded-b-2xl' : ''}`} >
                                <div className="flex flex-row justify-start items-center w-[15%]">{calculateElapsedTime(transaction.createdAt)}</div>
                                <div className="flex flex-row justify-start items-center w-[15%] text-md font-semibold">{transaction.type.split(' ')[0]}</div>
                                <div className="flex flex-row justify-start items-center w-[20%] space-x-[0.3vw]">
                                    <div>
                                        {amount1?.slice(0, amount1.indexOf('.') + 7)}
                                    </div>
                                    <Avatar className="w-[1vw] h-[1vw]">
                                        <AvatarImage src={token1?.img} alt="A" />
                                        <AvatarFallback>T</AvatarFallback>
                                    </Avatar>
                                    <div className="text-md font-semibold">{token1?.symbol}</div>
                                </div>
                                <div className="flex flex-row justify-start items-center w-[20%] space-x-[0.3vw]">
                                    {
                                        ['Sell Token', 'Buy Token', 'Transfer Token'].includes(transaction.type) ? <></> :
                                            <>
                                                <div>
                                                    {amount2?.slice(0, amount2.indexOf('.') + 7)}
                                                </div>
                                                <Avatar className="w-[1vw] h-[1vw]">
                                                    <AvatarImage src={token2?.img} alt="A" />
                                                    <AvatarFallback>T</AvatarFallback>
                                                </Avatar>
                                                <div className="text-md font-semibold">{token2?.symbol}</div>
                                            </>
                                    }
                                </div>
                                <div className="flex flex-row justify-start items-center w-[15%]">${formatPrice(parseFloat(transaction.price ?? ""))}</div>
                                <div className="flex flex-row justify-end items-center w-[15%]">{`${transaction.from_wallet.slice(0, 8)}...${transaction.from_wallet.slice(38, 42)}`}</div>
                            </div>
                        </div>
                    )
                })} </> :
                    <div className="flex flex-row justify-center items-center text-md font-medium min-h-[3vw]">Not yet exchange for {symbol}</div>
                }
            </div>
        </Card>
    )
}