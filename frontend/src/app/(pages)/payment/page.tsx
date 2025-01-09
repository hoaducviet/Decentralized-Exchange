'use client'
import { useState, useRef, useCallback, useEffect } from "react"
import { useAccount } from 'wagmi';
import { useCreateOrderIdPayMutation } from "@/redux/features/pay/paySlice";
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import SubmitItem from "@/components/exchange/SubmitItem"
import PaypalButton from '@/components/payment/PaypalButton'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import PopoverConnectWallet from "@/components/wallet/PopoverConnectWallet";
import { useToast } from "@/hooks/useToast";
import { useGetTokensQuery } from "@/redux/features/api/apiSlice";
import { WidthIcon } from "@radix-ui/react-icons";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type Price = {
    name: string;
    value: string;
}
const listPrice: Price[] = [
    { name: '$100', value: '100' },
    { name: '$300', value: '300' },
    { name: '$1000', value: '1000' },
]

type list = {
    name: string;
    value: string;
}

const listOptions: list[] = [
    { name: '0%', value: "0" },
    { name: '20%', value: "0.2" },
    { name: '50%', value: "0.5" },
    { name: '100%', value: "1" },
] as list[];

export default function Payment() {
    const { isConnected, address } = useAccount()
    const ref = useRef<HTMLInputElement>(null)
    const [amount, setAmount] = useState<string>('0')
    const [isActive, setIsActive] = useState<number | undefined>(undefined)
    const [open, setOpen] = useState<boolean>(false)
    const [orderId, setOrderId] = useState<string>('')
    const [qrCode, setQrCode] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)
    const [createOrderIdPay] = useCreateOrderIdPayMutation()
    const { showError } = useToast()
    const { data: tokens } = useGetTokensQuery()
    const eth = tokens?.find(item => item.symbol === 'ETH')
    const [valuePercent, setValuePercent] = useState<string>("0")
    const [percent, setPercent] = useState<string>("0")
    const [isActivePercent, setIsActivePercent] = useState<number>(0)

    const handleActivePercent = (index: number) => {
        setIsActivePercent(index)
        setPercent(listOptions[index].value)
    }

    useEffect(() => {
        const value = parseFloat(amount) * parseFloat(percent)
        setValuePercent(value.toFixed(2).toString())
    }, [amount, percent])

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
        <div className=" flex flex-col justify-start items-center pt-[10vw] ">
            <div className="flex flex-col w-[40vw] space-y-[2vw]">
                <Card onClick={handleClick} className=" flex flex-col w-full h-[15vw] select-none border-none outline-none">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardDescription>You are depositing USD from Paypal</CardDescription>
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
                <Card className='select-none border-none outline-none'>
                    <CardHeader className="flex flex-col justify-start items-start">
                        <CardTitle>Give percent Ether</CardTitle>
                        <CardDescription>The fee for give ETH from Exchange is +5%</CardDescription>
                    </CardHeader>
                    <div className="flex flex-row justify-center items-center text-2xl space-x-[1vw] mb-[1vw] ">
                        <p>
                            {`$${valuePercent}`}
                        </p>
                        <WidthIcon className="w-[2vw] h-[2vw]" />
                        <p>
                            {`${(parseFloat(valuePercent) * 0.95 / parseFloat(eth?.price || "")).toFixed(6)}ETH`}
                        </p>
                    </div>
                    <CardFooter className="flex justify-start items-center pb-[2%]">
                        {listOptions.map((item, index) => {
                            return (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    onClick={() => handleActivePercent(index)}
                                    className={`flex justify-center items-center rounded-2xl shadow-md  mr-2 ${isActivePercent === index && 'bg-purple-200 dark:bg-white/20'}`}
                                >{item.name}</Button>
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
                                                    <VisuallyHidden>
                                                        <DialogDescription>Please review number USD for deposit into Exchange!</DialogDescription>
                                                    </VisuallyHidden>
                                                </DialogHeader>
                                                <div className=' flex flex-col justify-center items-center w-full'>
                                                    <div className='flex flex-row w-full space-x-[1vw]'>
                                                        <div className='flex w-[50%]'>
                                                            <Image src={qrCode ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCode)}&size=70x70` : "/image/default-image.png"} priority={true} alt='qrcode' width={20} height={20} className='w-full h-full' />
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
                                                                    <div className="flex flex-row justify-between items-start">
                                                                        <p>Percent ETH</p>
                                                                        <div className="flex flex-col justify-start items-end space-y-[0.1vw]">
                                                                            <div className="flex flex-row justify-end">
                                                                                <p>{parseFloat(percent) * 100}</p>
                                                                                <p className="font-semibold">%</p>
                                                                            </div>
                                                                            <div className="flex flex-row justify-end">
                                                                                <p>{`${valuePercent}`}</p>
                                                                                <p className="font-semibold">USD</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='bg-transparent flex flex-col justify-end mt-[1vw]'>
                                                                <PaypalButton orderId={orderId} setOpen={setOpen} percent={percent} />
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
