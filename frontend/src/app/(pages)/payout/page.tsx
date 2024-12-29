'use client'
import { useState, useRef, useCallback, useEffect } from "react"
import { useAccount } from 'wagmi';
import { useAddPayoutMutation } from '@/redux/features/pay/paySlice'
import { Button } from "@/components/ui/button"
import SubmitItem from "@/components/exchange/SubmitItem"
import AddressItem from "@/components/exchange/AddressItem";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import PaymentTransactionWaiting from "@/components/transaction/PaymentTransactionWaiting";
import { useGasWithdrawUSD } from "@/hooks/useGas";
import PopoverConnectWallet from "@/components/wallet/PopoverConnectWallet";
import { useToast } from "@/hooks/useToast";
import Image from 'next/image'
import * as EmailValidator from 'email-validator';

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
    const { isConnected, address } = useAccount()
    const ref = useRef<HTMLInputElement>(null)
    const [amount, setAmount] = useState<string>('')
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const [isActive, setIsActive] = useState<number | undefined>(undefined)
    const [emailReceiver, setEmailReceiver] = useState<string>("");
    const [addPayout] = useAddPayoutMutation()
    const { showError } = useToast()
    const gasEth = useGasWithdrawUSD().toString()

    useEffect(() => {
        setIsChecked(parseFloat(amount) > 0 && EmailValidator.validate(emailReceiver))
    }, [emailReceiver, amount])

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
        if (address && parseFloat(amount) > 0) {
            try {
                const { data: response } = await addPayout({
                    address,
                    value: amount,
                    email: emailReceiver
                })
                if (response?._id) {
                    setIsActive(undefined)
                    setAmount("")
                    setEmailReceiver("")
                }
            } catch (error) {
                console.error(error)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, amount, emailReceiver])

    const handleToastAmount = () => {
        if (!isChecked) {
            showError("Invalid token quantity!")
        }
    }
    const handleToastEmail = () => {
        if (!isChecked) {
            showError("Invalid Email!")
        }
    }

    return (
        <div className=" flex flex-col justify-start items-center pt-[10vw]">
            <div className="flex flex-col w-[40vw] space-y-[0.5vw]">
                <Card onClick={handleClick} className=" flex flex-col w-full h-[15vw] select-none border-none outline-none">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardDescription>You are withdraw USD to Paypal</CardDescription>
                        <Image src="/image/paypal-logo.png" priority={true} alt="Paypal" width={20} height={20} className="w-[8vw] h-[2.5vw] object-cover" />
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
                                    className={`text-lg rounded-2xl shadow-md mx-2 ${(isActive === index || amount === item.value) && 'bg-purple-200 hover:bg-purple-200 dark:bg-white/20 dark:hover:bg-white/10 opacity-100'}`}>
                                    {item.name}
                                </Button>
                            )
                        })}
                    </CardFooter>
                </Card>
                <AddressItem address={emailReceiver} setAddress={setEmailReceiver} isEmail />
                {
                    isConnected ?
                        <>
                            {
                                isChecked ?
                                    <PaymentTransactionWaiting handleSend={handleWithdraw} type="Withdraw USD to Paypal" address={address} amount={amount} email={emailReceiver} gasEth={gasEth}>
                                        <div className="flex w-full">
                                            <SubmitItem name="Withdraw" isChecked={isChecked} />
                                        </div>
                                    </PaymentTransactionWaiting>
                                    :
                                    <div onClick={parseFloat(amount) > 0 ? handleToastEmail : handleToastAmount} className="flex w-full">
                                        <SubmitItem name="Withdraw" isChecked={isChecked} />
                                    </div>
                            }

                        </>
                        :
                        <PopoverConnectWallet>
                            <div className="flex w-full">
                                <SubmitItem name="Connect Wallet" />
                            </div>
                        </PopoverConnectWallet>
                }
            </div>
        </div>

    )
}
