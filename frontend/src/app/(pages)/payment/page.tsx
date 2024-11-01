'use client'
import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { setAmountDeposit } from "@/redux/features/deposit/depositSlice"
import { Button } from "@/components/ui/button"
import SubmitItem from "@/components/exchange/SubmitItem"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import PaypalButton from '@/components/payment/PaypalButton'
import Image from 'next/image'
import { useAccount } from 'wagmi';
import axios from 'axios';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
type Price = {
    name: string;
    value: string;
}
const listPrice: Price[] = [
    { name: '$100', value: '100' },
    { name: '$300', value: '300' },
    { name: '$1000', value: '1000' },
]

export default function Payment() {
    const { address } = useAccount()
    const router = useRouter()
    const dispatch = useDispatch()
    const ref = useRef<HTMLInputElement>(null)
    const [amount, setAmount] = useState<string>('')
    const [isActive, setIsActive] = useState<number | undefined>(undefined)
    const [open, setOpen] = useState<boolean>(false)
    const [orderId, setOrderId] = useState<string>('')
    const [qrCode, setQrCode] = useState<string>('')

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
    const handleDeposit = useCallback(async () => {
        console.log(amount)
        if (parseFloat(amount) > 0) {
            try {
                const response = await axios.post(
                    "http://localhost:8000/payment/paypal/orderid",
                    { address, amount }, {
                    timeout: 100000,
                })
                if (response.status === 200) {
                    setOrderId(response.data.id)
                    setQrCode(response.data.url)
                    setOpen(true)
                    console.log(response)

                }

            } catch (error) {
                console.error(error)
            }
        } else {
            setOpen(false)
        }
    }, [amount])

    return (
        <div className=" flex flex-col justify-start items-center pt-[10vw]">
            <div className="flex flex-col w-[40vw]">
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
                <div className="flex">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger className="flex w-full" asChild>
                            <div onClick={handleDeposit} className="flex h-[3vw]">
                                <SubmitItem name="Deposit" />
                            </div>
                        </DialogTrigger>
                        <DialogContent className="bg-transparent text-white w-[40vw] px-0 pb-0 border-none">
                            <DialogHeader>
                                <DialogTitle>Deposit USD from Paypal.</DialogTitle>
                            </DialogHeader>
                            <div className=' flex flex-col justify-center items-center w-full'>
                                <div className='flex flex-row w-full space-x-[0.5vw]'>
                                    <div className='flex w-[40%]'>
                                        <Image src={qrCode ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCode)}&size=70x70` : "/image/default-image.png"} alt='qrcode' width={20} height={20} className='w-full h-full' />
                                    </div>
                                    <div className='flex flex-col justify-between w-[60%]'>
                                        <div className="flex flex-col space-y-[1vw]">
                                            <div className="flex font-semibold text-md">Transaction</div>
                                            <div className="flex flex-col">
                                                <div className="flex flex-row font-semibold text-md space-x-[1vw]">
                                                    <div className="w-[25%]">Currency</div>
                                                    <div className="w-[25%]">Amount</div>
                                                    <div className="w-[50%]">Address</div>
                                                </div>
                                                <div className="flex flex-row space-x-[1vw]">
                                                    <div className="w-[25%]">USD</div>
                                                    <div className="w-[25%]">{amount ? amount : '0'}</div>
                                                    <div className="w-[50%]">{address ? address.slice(0, 6) + "..." + address.slice(38) : ""}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='bg-blue-300 '>
                                            {<PaypalButton orderId={orderId} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
