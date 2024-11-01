'use client'
import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import axios from 'axios';
import { useAccount } from 'wagmi';
import { Button } from "@/components/ui/button"
import SubmitItem from "@/components/exchange/SubmitItem"
import AddressItem from "@/components/exchange/AddressItem";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { ethers } from "ethers";


type Price = {
    name: string;
    value: string;
}
const listPrice: Price[] = [
    { name: '$100', value: '100' },
    { name: '$300', value: '300' },
    { name: '$1000', value: '1000' },
]

export default function Payout() {
    const { address } = useAccount()
    const router = useRouter()
    const ref = useRef<HTMLInputElement>(null)
    const [amount, setAmount] = useState<string>('')
    const [isActive, setIsActive] = useState<number | undefined>(undefined)
    const [addressReceiver, setAddressReceiver] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setAmount(value.replace(',', '.'))
        setIsActive(undefined)
    }
    const handleClick = () => {
        if (ref.current) {
            ref.current.focus()
        }
    }

    const handleActive = (index: number, item: Price) => {
        setIsActive(index)
        setAmount(item.value)
    }
    const handleWithdraw = useCallback(async () => {
        console.log(amount, addressReceiver)
        if (parseFloat(amount) > 0 && ethers.isAddress(addressReceiver)) {
            try {
                const response = await axios.post(
                    "http://localhost:8000/payment/paypal/payout",
                    { address, value: amount }, {
                    timeout: 100000,
                })
                if (response.status === 200) {
                    setIsActive(undefined)
                    setAmount("")
                    setAddressReceiver("")
                    alert('success withdraw')
                }

            } catch (error) {
                console.error(error)
            }
        }
    }, [amount, addressReceiver])
    return (
        <div className=" flex flex-col justify-start items-center pt-[10vw]">
            <div className="flex flex-col w-[40vw] space-y-[0.5vw]">
                <Card onClick={handleClick} className=" flex flex-col w-full h-[15vw] select-none border-none outline-none">
                    <CardHeader className="flex justify-start">
                        <CardDescription>You are depositing USD from Bank</CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col justify-center items-center w-full'>
                        <div className='flex flex-row justify-center items-center w-full text-7xl'>
                            <p>$</p>
                            <input
                                ref={ref}
                                type='number'
                                step='any'
                                value={amount.slice(0, amount.indexOf(".") + 7)}
                                onChange={handleChange}
                                className="appearance-none bg-transparent text-start border-none outline-none focus:caret-black-500 max-w-[80%] font-medium"
                                style={{ width: amount.length === 0 ? '1px' : `${(amount.length + 0.5) * 2.5}rem` }}
                            />
                            {amount.length === 0 ? <p>0</p> : <></>}
                        </div>

                    </CardContent>
                    <CardFooter className="flex flex-row justify-center items-center">
                        {listPrice.map((item, index) => {
                            return (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    onClick={() => handleActive(index, item)}
                                    className={`text-lg rounded-2xl shadow-md mx-2 ${(isActive === index || amount === item.value) && 'bg-purple-200 hover:bg-purple-200 opacity-100'}`}>
                                    {item.name}
                                </Button>
                            )
                        })}
                    </CardFooter>
                </Card>
                <AddressItem address={addressReceiver} setAddress={setAddressReceiver} />
                <div onClick={handleWithdraw} className="flex">
                    <SubmitItem name="Withdraw" />
                </div>
            </div>
        </div>
    )
}
