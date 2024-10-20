'use client'

import { useParams } from "next/navigation"
import PoolChart from "@/components/chart/poolChart"
import PoolTransactions from "@/components/explore/PoolTransactions"

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

export default function Pool() {
    const { token } = useParams()
    console.log(token)

    return (
        <div className="flex flex-col justify-center items-start mx-[15vw] my-[5vw]">
            <div className="w-full">
                <PoolChart />
            </div>
            <div className="flex flex-col w-full">
                <p>Transactions</p>
                <PoolTransactions transactions={transactions}/>
            </div>
        </div>
    )
}