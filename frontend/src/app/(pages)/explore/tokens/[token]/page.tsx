'use client'

import { useParams } from "next/navigation"
import TokenChart from "@/components/chart/tokenChart"
import TokenTransactions from "@/components/Explore/TokenTransactions"

const transactions = [
    {
        time: '7m ago',
        type: 'Buy',
        amount: '0.55',
        to: '0,22 USDT',
        price: '$123.231',
        wallet: '0x2123...1345'
    },
    {
        time: '8m ago',
        type: 'Sell',
        amount: '0.55',
        to: '0,22 USDT',
        price: '$123.231',
        wallet: '0x2123...1345'
    },
    {
        time: '9m ago',
        type: 'Buy',
        amount: '0.55',
        to: '0,22 USDT',
        price: '$123.231',
        wallet: '0x2123...1345'
    },
    {
        time: '10m ago',
        type: 'Buy',
        amount: '0.55',
        to: '0,22 USDT',
        price: '$123.231',
        wallet: '0x2123...1345'
    },
    {
        time: '9m ago',
        type: 'Buy',
        amount: '0.55',
        to: '0,22 USDT',
        price: '$123.231',
        wallet: '0x2123...1345'
    },
    {
        time: '10m ago',
        type: 'Buy',
        amount: '0.55',
        to: '0,22 USDT',
        price: '$123.231',
        wallet: '0x2123...1345'
    },
    {
        time: '9m ago',
        type: 'Buy',
        amount: '0.55',
        to: '0,22 USDT',
        price: '$123.231',
        wallet: '0x2123...1345'
    },
    {
        time: '10m ago',
        type: 'Buy',
        amount: '0.55',
        to: '0,22 USDT',
        price: '$123.231',
        wallet: '0x2123...1345'
    },
    {
        time: '9m ago',
        type: 'Buy',
        amount: '0.55',
        to: '0,22 USDT',
        price: '$123.231',
        wallet: '0x2123...1345'
    },
    {
        time: '10m ago',
        type: 'Buy',
        amount: '0.55',
        to: '0,22 USDT',
        price: '$123.231',
        wallet: '0x2123...1345'
    },
    {
        time: '9m ago',
        type: 'Buy',
        amount: '0.55',
        to: '0,22 USDT',
        price: '$123.231',
        wallet: '0x2123...1345'
    },
    {
        time: '10m ago',
        type: 'Buy',
        amount: '0.55',
        to: '0,22 USDT',
        price: '$123.231',
        wallet: '0x2123...1345'
    },
    {
        time: '9m ago',
        type: 'Buy',
        amount: '0.55',
        to: '0,22 USDT',
        price: '$123.231',
        wallet: '0x2123...1345'
    },
    {
        time: '10m ago',
        type: 'Buy',
        amount: '0.55',
        to: '0,22 USDT',
        price: '$123.231',
        wallet: '0x2123...1345'
    },

]

export default function Token() {
    const { token } = useParams()
    console.log(token)

    return (
        <div className="flex flex-col justify-center items-start mx-[15vw] my-[5vw]">
            <div className="w-full">
                <TokenChart />
            </div>
            <div className="flex flex-col w-full">
                <p>Transactions</p>
                <TokenTransactions transactions={transactions}/>
            </div>
        </div>
    )
}