'use client'
import { useGetTokenTransactionAllQuery } from "@/redux/features/api/apiSlice"
import { calculateElapsedTime } from "@/utils/calculateElapsedTime"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRightIcon } from "@radix-ui/react-icons";
const options = ['Time', 'Type', 'USD', 'Detail', 'Wallet']

export default function Transactions() {
    const { data: transactions, isFetching } = useGetTokenTransactionAllQuery()
    return (
        <div className="flex flex-col">
            {!isFetching && transactions?.length && <>
                <div className="bg-secondary/80 hover:bg-secondary flex flex-row justify-between items-center text-md font-semibold h-[2vw] px-3">
                    <div className="w-[15%] flex flex-col justify-start">{options[0]}</div>
                    <div className="w-[25%] flex flex-row justify-start">{options[1]}</div>
                    <div className="w-[20%] flex flex-row justify-start">{options[2]}</div>
                    <div className="w-[25%] flex flex-row justify-start">{options[3]}</div>
                    <div className="w-[20%] flex flex-row justify-end">{options[4]}</div>
                </div>
                <div className="flex flex-col max-h-[50vw] overflow-x-auto text-md font-semibold">
                    {transactions.map((item, index) => {
                        const wallet = item.from_wallet.slice(0, 6) + "..." + item.from_wallet.slice(38)
                        return (<div key={index} className="hover:bg-secondary/80 cursor-pointer flex flex-row justify-between items-center h-[3.5vw] px-3">
                            <div className="w-[15%] flex flex-col justify-start font-medium">{calculateElapsedTime(item.createdAt)}</div>
                            <div className="w-[25%] flex flex-row items-center justify-start space-x-[0.3vw]">
                                <div className="font-medium">{item.type.split(" ")[0]}</div>
                                <div className="flex flex-row items-center space-x-[0.2vw]">
                                    <Avatar className="w-[1vw] h-[1vw]">
                                        <AvatarImage src={item.from_token_id?.img} alt="Token" />
                                        <AvatarFallback>T</AvatarFallback>
                                    </Avatar>
                                    <div>{item.from_token_id?.symbol}</div>
                                </div>
                                {item.to_token_id && <>
                                    <ArrowRightIcon width={20} height={20} />
                                    <div className="flex flex-row items-center space-x-[0.2vw]">
                                        <Avatar className="w-[1vw] h-[1vw]">
                                            <AvatarImage src={item.to_token_id?.img} alt="Token" />
                                            <AvatarFallback>T</AvatarFallback>
                                        </Avatar>
                                        <div>{item.to_token_id?.symbol}</div>
                                    </div>
                                </>}
                            </div>
                            <div className="w-[20%] flex flex-row justify-start">$ {item.price?.slice(0, item.price.indexOf(".") + 7)}</div>
                            <div className="w-[25%] flex flex-row items-center space-x-[0.3vw]">
                                <div>
                                    <div className="flex flex-row items-center space-x-[0.2vw]">
                                        <div className="font-medium">{item.amount_in}</div>
                                        <div>{item.from_token_id?.symbol}</div>
                                    </div>
                                </div>
                                {item.to_token_id && <>
                                    <ArrowRightIcon width={20} height={20} />
                                    <div className="flex flex-row items-center space-x-[0.2vw]">
                                        <div className="font-medium">{item.amount_out?.slice(0, item.amount_out?.indexOf(".") + 7)}</div>
                                        <div>{item.to_token_id?.symbol}</div>
                                    </div>
                                </>}
                            </div>
                            <div className="w-[20%] flex flex-row justify-end opacity-85">{wallet}</div>
                        </div>)
                    })}
                </div>
            </>
            }
        </div>
    )
}