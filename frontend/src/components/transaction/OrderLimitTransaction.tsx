import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react";
import { Children, OrderActiveTransaction } from "@/lib/type"
import { useCancelOrderMutation } from "@/redux/features/api/apiSlice";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
    children: Children;
    transaction: OrderActiveTransaction;
}

export default function OrderLimitTransaction({ children, transaction }: Props) {
    const [open, setOpen] = useState(false)
    const [cancelOrder] = useCancelOrderMutation()

    const handleWithdraw = async () => {
        console.log("Withdraw")
        await cancelOrder({ order_id: transaction.order_id })
        setOpen(false)
    } 

    const date = new Date(transaction.createdAt);
    const formattedDate = date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const dateExpired = new Date(transaction.expiredAt);
    const formattedDateExpired = dateExpired.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="select-none w-[23vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                <DialogHeader className="bg-fixed w-full">
                    <DialogTitle>{transaction.type}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>Information Order Limit Transaction</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <div className="flex flex-col w-full h-full overflow-x-auto space-y-[1vw] mb-[1vw]">
                    <div className="flex flex-row justify-center items-center space-x-2">
                        <div className="flex flex-row justify-center items-center space-x-2">
                            <Avatar className="w-[2vw] h-[2vw] max-w-[5vw] border border-blue-200">
                                <AvatarImage src={transaction.from_token_id?.img} alt="One" />
                                <AvatarFallback>T</AvatarFallback>
                            </Avatar>
                            <div className="text-md font-semibold">{transaction.from_token_id?.symbol}</div>
                        </div>
                        <ArrowRightIcon width={20} height={20} />
                        <div className="flex flex-row justify-center items-center space-x-2">
                            <Avatar className="w-[2vw] h-[2vw] max-w-[5vw] border border-blue-200">
                                <AvatarImage src={transaction.to_token_id?.img} alt="One" />
                                <AvatarFallback>T</AvatarFallback>
                            </Avatar>
                            <div className="text-md font-semibold">{transaction.to_token_id?.symbol}</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-4 text-sm divide-y-reverse-[5px]">
                    <div className="flex flex-row justify-between items-center">
                        <p>From</p>
                        <p>{`${transaction.from_wallet.slice(0, 6)}...${transaction.from_wallet.slice(38)}`}</p>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <p>To</p>
                        <p>{`${transaction.to_wallet.slice(0, 6)}...${transaction.to_wallet.slice(38)}`}</p>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <p>Status</p>
                        <p>{transaction.status}</p>
                    </div>
                    <div className="flex flex-row justify-between items-start">
                        <p>Token</p>
                        <div className="flex flex-col">
                            <div className="flex flex-row space-x-1 justify-end">
                                <p>{`- ${Number.isInteger(parseFloat(transaction.amount_in)) ? transaction.amount_in : parseFloat(transaction.amount_in).toFixed(6)}`}</p>
                                <p className="font-semibold">{transaction.from_token_id?.symbol}</p>
                            </div>
                            <div className="flex flex-row space-x-1 justify-end text-xs italic">
                                <p>Address:</p>
                                <p>{`${transaction.from_token_id?.address?.slice(0, 6)}...${transaction.from_token_id?.address?.slice(38)}`}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-start">
                        <p>Token</p>
                        <div className="flex flex-col">
                            <div className="flex flex-row space-x-1 justify-end">
                                <p className="font-semibold">{transaction.to_token_id.symbol}</p>
                            </div>
                            <div className="flex flex-row space-x-1 justify-end text-xs italic">
                                <p>Address:</p>
                                <p>{`${transaction.to_token_id.address?.slice(0, 6)}...${transaction.to_token_id.address?.slice(38)}`}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-start">
                        <p>Price</p>
                        <div className="flex flex-col">
                            <div className="flex flex-row space-x-1 justify-end">
                                <p>{transaction.price}</p>
                                <p className="font-semibold">{`${transaction.from_token_id.symbol}/${transaction.to_token_id.symbol}`}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <p>Hash</p>
                        <p className="text-xs italic">{`${transaction.receipt_hash?.slice(0, 15)}...${transaction.receipt_hash?.slice(50)}`}</p>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <p>Time</p>
                        <p className="text-xs italic">{formattedDate}</p>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <p>Expired</p>
                        <p className="text-xs italic">{formattedDateExpired}</p>
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center w-full pt-[1vw]">
                    <div onClick={handleWithdraw} className="cursor-pointer flex flex-row justify-center items-center bg-blue-500 hover:bg-blue-600 text-white w-[40%] h-[2vw] rounded-xl font-semibold text-sm">Withdraw</div>
                </div>
            </DialogContent>
        </Dialog>
    )
}