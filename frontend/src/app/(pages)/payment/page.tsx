'use client'
import { useState, useRef, useCallback } from "react"
import { useAccount } from 'wagmi';
import { useCreateOrderIdPayMutation } from "@/redux/features/pay/paySlice";
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import SubmitItem from "@/components/exchange/SubmitItem"
import PaypalButton from '@/components/payment/PaypalButton'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import PopoverConnectWallet from "@/components/wallet/PopoverConnectWallet";
import { useToast } from "@/hooks/useToast";

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
    const { isConnected, address } = useAccount()
    const ref = useRef<HTMLInputElement>(null)
    const [amount, setAmount] = useState<string>('')
    const [isActive, setIsActive] = useState<number | undefined>(undefined)
    const [open, setOpen] = useState<boolean>(false)
    const [orderId, setOrderId] = useState<string>('')
    const [qrCode, setQrCode] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)
    const [createOrderIdPay] = useCreateOrderIdPayMutation()
    const { showError } = useToast()

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
        if (address && parseFloat(amount) > 0) {
            try {
                setLoading(true)
                const { data: response } = await createOrderIdPay({
                    address,
                    value: amount
                })
                console.log(response)
                if (response?.id && response?.url) {
                    setOrderId(response.id)
                    setQrCode(response.url)
                    setOpen(true)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        } else {
            setOpen(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amount, address])

    const handleToastAmount = () => {
        showError("Invalid token quantity!")
    }

    return (
        <div className=" flex flex-col justify-start items-center pt-[10vw]">
            <div className="flex flex-col w-[40vw]">
                <Card onClick={handleClick} className=" flex flex-col w-full h-[15vw] select-none border-none outline-none">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardDescription>You are depositing USD from Paypal</CardDescription>
                        <Image src="/image/paypal-logo.png" alt="Paypal" width={20} height={20} className="w-[8vw] h-[2.5vw] object-cover" />
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
                {
                    isConnected ?
                        <>
                            {
                                parseFloat(amount) > 0 ?
                                    <Dialog open={open} onOpenChange={setOpen}>
                                        <DialogTrigger className="flex w-full" asChild>
                                            <div onClick={async () => {
                                                await handleDeposit()
                                                setOpen(true)
                                            }} className="flex h-[3vw]">
                                                <SubmitItem name="Deposit" isChecked={parseFloat(amount) > 0} />
                                            </div>
                                        </DialogTrigger>
                                        {!loading && <>
                                            <DialogContent className="select-none bg-transparent text-white w-[70vw] px-0 pb-0 border-none space-y-[1vw]">
                                                <DialogHeader>
                                                    <DialogTitle className="flex flex-row justify-center">Deposit USD from Paypal.</DialogTitle>
                                                </DialogHeader>
                                                <div className=' flex flex-col justify-center items-center w-full'>
                                                    <div className='flex flex-row w-full space-x-[1vw]'>
                                                        <div className='flex w-[40%]'>
                                                            <Image src={qrCode ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCode)}&size=70x70` : "/image/default-image.png"} alt='qrcode' width={20} height={20} className='w-full h-full' />
                                                        </div>
                                                        <div className='flex flex-col justify-between w-[60%]'>
                                                            <div className="flex flex-col space-y-[1vw]">
                                                                <div className="flex font-semibold text-md">Transaction</div>
                                                                <div className="flex flex-col space-y-[1vw]">
                                                                    <div className="flex flex-row justify-between items-center">
                                                                        <p> Amount</p>
                                                                        <p className="">{amount ? amount : '0'}</p>
                                                                    </div>
                                                                    <div className="flex flex-row justify-between items-center">
                                                                        <p>Currency</p>
                                                                        <p>USD</p>
                                                                    </div>
                                                                    <div className="flex flex-row justify-between items-center">
                                                                        <p>Address</p>
                                                                        <div >{address ? address.slice(0, 6) + "..." + address.slice(38) : ""}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='bg-transparent flex flex-col justify-end'>
                                                                <PaypalButton orderId={orderId} setOpen={setOpen} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </>}
                                    </Dialog>
                                    :
                                    <div onClick={handleToastAmount} className="flex w-full">
                                        <SubmitItem name="Deposit" />
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
