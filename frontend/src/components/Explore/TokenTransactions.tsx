'use client'
import { calculateElapsedTime } from "@/utils/calculateElapsedTime"
import { TokenActiveTransaction } from "@/lib/type";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface Props {
    transactions: TokenActiveTransaction[];
    symbol: string;
}

const headers = ["Time", "Type", "$ETH", "For", "USD", "Wallet"]
export default function TokenTransactions({ transactions, symbol }: Props) {

    return (
        <div className="select-none flex flex-col">
            <div className="bg-secondary/80 flex flex-row justify-between h-[3vw] text-md font-semibold opacity-65 px-5">
                <div className="flex flex-row justify-start items-center w-[15vw]">{headers[0]}</div>
                <div className="flex flex-row justify-start items-center w-[15vw]">{headers[1]}</div>
                <div className="flex flex-row justify-start items-center w-[20vw]">{symbol}</div>
                <div className="flex flex-row justify-start items-center w-[20vw]">{headers[3]}</div>
                <div className="flex flex-row justify-start items-center w-[15vw]">{headers[4]}</div>
                <div className="flex flex-row justify-end items-center w-[15vw]">{headers[5]}</div>
            </div>
            <div className="flex flex-col max-h-[50vw] overflow-x-auto">
                {transactions.length ? <> {transactions.map((transaction, index) => {
                    const [token1, token2] = transaction.from_token_id.symbol === "ETH" ? [transaction.from_token_id, transaction.to_token_id] : [transaction.to_token_id, transaction.from_token_id]
                    const [amount1, amount2] = transaction.from_token_id.symbol === "ETH" ? [transaction.amount_in, transaction.amount_out] : [transaction.amount_out, transaction.amount_in]
                    return (
                        <div key={index} className="cursor-pointer flex flex-row justify-between items-center text-md font-medium hover:bg-secondary/80 min-h-[3.5vw] px-5">
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
                            <div className="flex flex-row justify-start items-center w-[15%]">$ {transaction.price?.slice(0, transaction.price.indexOf('.') + 4)}</div>
                            <div className="flex flex-row justify-end items-center w-[15%]">{`${transaction.from_wallet.slice(0, 8)}...${transaction.from_wallet.slice(38, 42)}`}</div>
                        </div>
                    )
                })} </> :
                    <div className="flex flex-row justify-center items-center text-md font-medium min-h-[3vw]">Not yet exchange for {symbol}</div>
                }
            </div>
        </div>
    )
}