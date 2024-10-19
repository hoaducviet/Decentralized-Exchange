'use client'

const listHeaders = [
    { name: "Time" },
    { name: "Type" },
    { name: "$ETH" },
    { name: "For" },
    { name: "USD" },
    { name: "Wallet" },
]

type transaction = {
    time: string,
    type: string,
    amount: string,
    to: string,
    price: string,
    wallet: string
}

interface Props {
    transactions: transaction[];
}
export default function TokenTransactions({ transactions }: Props) {

    return (
        <div className="flex flex-col w-full">
            <div className="bg-purple-50 flex flex-row w-full space-x-[2%] pl-[5vw] h-[3vw]">
                {listHeaders.map((item, index) => {
                    return (
                        <div key={index} className="flex flex-col justify-center items-start text-md font-medium w-[15%]">
                            {item.name}
                        </div>
                    )
                })}
            </div>
            <div className="flex flex-col w-full max-h-[40vw] overflow-x-auto">
                {transactions.map((transaction, index) => {
                    return (
                        <div key={index} className="flex flex-row text-md font-medium space-x-[2%] hover:bg-secondary/80 w-full h-[4vw] pl-[5vw]">
                            <div className="flex flex-col justify-center items-start  w-[15%]">{transaction.time}</div>
                            <div className="flex flex-col justify-center items-start  w-[15%]">{transaction.type}</div>
                            <div className="flex flex-col justify-center items-start  w-[15%]">{transaction.amount}</div>
                            <div className="flex flex-col justify-center items-start  w-[15%]">{transaction.to}</div>
                            <div className="flex flex-col justify-center items-start  w-[15%]">{transaction.price}</div>
                            <div className="flex flex-col justify-center items-start  w-[15%]">{transaction.wallet}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}