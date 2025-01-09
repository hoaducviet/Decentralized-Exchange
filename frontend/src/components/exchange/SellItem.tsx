'use client'
import { useRef, useState, useEffect, Dispatch, SetStateAction } from "react"
import Image from "next/image"
import DialogItem from "@/components/exchange/DialogItem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Token } from "@/lib/type"

type Price = {
    name: string;
    value: string;
}

const listPrice: Price[] = [
    { name: '0.5', value: '0.5' },
    { name: '1', value: '1' },
    { name: '10', value: '10' },
]

interface Props {
    token: Token | undefined;
    tokens: Token[] | [];
    setToken: Dispatch<SetStateAction<Token | undefined>>;
    setAmount: Dispatch<SetStateAction<string>>;
    amount1: string;
    amount2: string;
} 

export default function SellItem({ token, tokens, setToken, setAmount, amount1, amount2 }: Props) {
    const ref = useRef<HTMLInputElement>(null)
    const [isActive, setIsActive] = useState<number | undefined>()

    useEffect(() => {
        if (amount2 === "") {
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
            <CardHeader className="flex flex-row justify-between w-full">
                <CardDescription className="flex items-center w-[70%]">You are sell token to USD</CardDescription>
                <div className="flex flex-col justify-center items-center w-[30%]">
                    <DialogItem tokens={tokens} setToken={setToken}>
                        <div className="flex flex-row justify-end items-center text-xl font-medium h-full px-[1vw]">
                            <Image src={token?.img || "/image/default-token.png"} priority={true} alt={token?.name || "token"} width="20" height="20" className="mr-[0.2vw]" />
                            <p className="font-semibold ml-[0.2vw]">{token?.symbol}</p>
                            <CaretDownIcon className="w-[1.5vw] h-[2.5vh]" />
                        </div>
                    </DialogItem>
                </div>
            </CardHeader>
            <CardContent className='flex flex-col justify-center items-center w-full'>
                <div className='flex flex-row justify-center items-center w-full text-7xl'>
                    <input
                        ref={ref}
                        type='number'
                        step='any'
                        value={amount1.slice(0, amount1.indexOf(".") + 7)}
                        onChange={handleChange}
                        className="appearance-none bg-transparent text-end border-none outline-none focus:caret-black-500 max-w-[80%] font-medium"
                        style={{ width: amount1.length === 0 ? '1px' : `${(amount1.length + 0.5) * 2.5}rem` }}
                    />
                    {amount1.length === 0 ? <p>0</p> : <div className="text-xl font-semibold mx-[1vw]">{token?.symbol}</div>}
                </div>
                <div className="flex flex-row justify-center items-center text-xl font-medium opacity-50 w-full h-full">
                    <p className="mr-[0.1vw]">$</p>
                    {amount2.length === 0 ? <p className="font-medium ml-[0.1vw]">0</p> : <></>}
                    <p className="mx-[0.1vw]">{amount2.slice(0, amount2.indexOf(".") + 7)}</p>
                    <p className="font-bold ml-[0.1vw]">USD</p>
                </div>
            </CardContent>
            <CardFooter className="flex flex-row justify-center items-center">
                {listPrice.map((item, index) => {
                    return (
                        <Button
                            key={index}
                            variant="ghost"
                            onClick={() => handleActive(index, item)}
                            className={`text-lg rounded-2xl shadow-md mx-2 ${(isActive === index || amount1 === item.value) && 'bg-purple-200 dark:bg-white/20 opacity-100'}`}>
                            <div className="flex flex-row">
                                <p className="mr-[0.1vw]">{item.name}</p>
                                <p className="font-semibold ml-[0.1vw]">{token?.symbol}</p>
                            </div>
                        </Button>
                    )
                })}
            </CardFooter>
        </Card>
    )
}