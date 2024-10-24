'use client'
import { useRef, useState, Dispatch, SetStateAction, useEffect } from "react"
import Image from "next/image"
import DialogItem from "@/components/exchange/DialogItem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { CaretDownIcon } from "@radix-ui/react-icons";
import { TokenBalancesType } from "@/lib/type"

type Price = {
    name: string;
    value: string;
}

const listPrice: Price[] = [
    { name: '$100', value: '100' },
    { name: '$300', value: '300' },
    { name: '$1000', value: '1000' },
]

interface Props {
    tokenBalance: TokenBalancesType | undefined;
    tokenBalances: TokenBalancesType[] | [];
    setToken: Dispatch<SetStateAction<TokenBalancesType | undefined>>;
    setAmount: Dispatch<SetStateAction<string>>;
    amount1: string;
    amount2: string;
}

export default function BuyItem({ tokenBalance, tokenBalances, setToken, setAmount, amount1, amount2 }: Props) {
    const ref = useRef<HTMLInputElement>(null)
    const [isActive, setIsActive] = useState<number | undefined>()

    useEffect(() => {
        if(amount2 === ""){
            setIsActive(undefined)
        }
    }, [amount2])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value)
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

    return (
        <Card onClick={handleClick} className=" flex flex-col w-full h-full select-none border-none outline-none">
            <CardHeader className="flex justify-start">
                <CardDescription>You are buying token from USD</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col justify-center items-center w-full'>
                <div className='flex flex-row justify-center items-center w-full text-7xl'>
                    <p>$</p>
                    <input
                        ref={ref}
                        type='number'
                        step='any'
                        value={amount1.slice(0, amount1.indexOf(".") + 7)}
                        onChange={handleChange}
                        className="appearance-none bg-transparent text-start border-none outline-none focus:caret-black-500 max-w-[80%] font-medium"
                        style={{ width: amount1.length === 0 ? '1px' : `${(amount1.length + 0.5) * 2.5}rem` }}
                    />
                    {amount1.length === 0 ? <p>0</p> : <></>}
                </div>
                <DialogItem tokenBalances={tokenBalances} setToken={setToken}>
                    <div className="flex flex-row justify-center items-center text-xl font-medium w-full h-full">
                        <Image src={tokenBalance?.info.img || "/image/default-token.png"} alt={tokenBalance?.info.name || "token"} width="20" height="24" className="mr-[0.1vw]" />
                        <p className="opacity-50 mx-[0.1vw]">{amount2.slice(0, amount2.indexOf(".") + 7)}</p>
                        {amount2.length === 0 ? <p className="opacity-50 font-medium ml-[0.1vw]">0</p> : <></>}
                        <p className="opacity-50 font-semibold ml-[0.1vw]">{tokenBalance?.info.symbol}</p>
                        <CaretDownIcon className="opacity-50 w-[1.5vw] h-[2.5vh]" />
                    </div>
                </DialogItem>
            </CardContent>
            <CardFooter className="flex flex-row justify-center items-center">
                {listPrice.map((item, index) => {
                    return (
                        <Button
                            key={index}
                            variant="ghost"
                            onClick={() => handleActive(index, item)}
                            className={`text-lg rounded-2xl shadow-md mx-2 ${(isActive === index || amount1 === item.value) && 'bg-purple-200 hover:bg-purple-200 opacity-100'}`}>
                            {item.name}
                        </Button>
                    )
                })}
            </CardFooter>
        </Card>
    )
}