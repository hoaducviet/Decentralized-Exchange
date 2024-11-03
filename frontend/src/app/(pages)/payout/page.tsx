'use client'
import { useState, useRef, useCallback } from "react"
import { useAccount } from 'wagmi';
import axios from 'axios';
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import SubmitItem from "@/components/exchange/SubmitItem"
import AddressItem from "@/components/exchange/AddressItem";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"

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
    const [emailReceiver, setEmailReceiver] = useState<string>("");

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
        console.log(amount, emailReceiver)
        if (parseFloat(amount) > 0) {
            try {
                const response = await axios.post(
                    "http://localhost:8000/payment/paypal/payout",
                    { address, value: amount, email: emailReceiver }, {
                    timeout: 100000,
                })
                if (response.status === 200) {
                    setIsActive(undefined)
                    setAmount("")
                    setEmailReceiver("")
                    alert('success withdraw')
                }

            } catch (error) {
                console.error(error)
            } finally {
                router.push('/success')
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, amount, emailReceiver])
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
                <AddressItem address={emailReceiver} setAddress={setEmailReceiver} isEmail />

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <div>
                            <SubmitItem name="Withdraw" />
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Withdraw USD to Paypal</AlertDialogTitle>
                            <div className="flex font-semibold text-md">Transaction</div>
                            <div className="flex flex-col">
                                <div className="flex flex-row font-semibold text-md space-x-[1vw]">
                                    <div className="w-[15%]">Currency</div>
                                    <div className="w-[15%]">Amount</div>
                                    <div className="w-[30%]">Address</div>
                                    <div className="w-[40%]">Email</div>
                                </div>
                                <div className="flex flex-row space-x-[1vw]">
                                    <div className="w-[15%]">USD</div>
                                    <div className="w-[15%]">{amount ? amount : '0'}</div>
                                    <div className="w-[30%]">{address ? address.slice(0, 6) + "..." + address.slice(38) : ""}</div>
                                    <div className="w-[40%]">{emailReceiver}</div>
                                </div>
                            </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleWithdraw} >
                                Withdraw
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>

    )
}
