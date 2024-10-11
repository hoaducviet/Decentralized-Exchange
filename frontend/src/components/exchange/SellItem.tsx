'use client'
import { useRef, useState } from "react"
import Image from "next/image"
import DialogItem from "@/components/exchange/DialogItem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Token } from "@/lib/type"

const listPrice = [
    { name: '0.5', value: '0.5' },
    { name: '1', value: '1' },
    { name: '10', value: '10' },
]

interface Props {
    token: Token;
}

export default function SellItem({ token }: Props) {
    const ref = useRef<HTMLInputElement>(null)
    const [isActive, setIsActive] = useState<number | undefined>()
    const [value, setValue] = useState<string>("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        setIsActive(undefined)
    }
    const handleClick = () => {
        if (ref.current) {
            ref.current.focus()
        }
    }
    const handleActive = (index: number, item: any) => {
        setIsActive(index)
        setValue(item.value)
    }

    return (
        <Card onClick={handleClick} className=" flex flex-col w-full h-full select-none border-none outline-none">
            <CardHeader className="flex flex-row justify-between w-full">
                <CardDescription className="flex items-center w-[70%]">You are sell token to USD</CardDescription>
                <div className="flex flex-col justify-center items-center w-[30%]">
                    <DialogItem>
                        <div className="flex flex-row justify-end items-center text-xl font-medium h-full px-[1vw]">
                            <Image src={token.img} alt={token.name} width="20" height="24" className="mr-[0.2vw]" />
                            <p className="font-semibold ml-[0.2vw]">{token.ticker}</p>
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
                        value={parseFloat(value)}
                        onChange={handleChange}
                        className="appearance-none bg-transparent text-end border-none outline-none focus:caret-black-500 max-w-[80%] font-medium"
                        style={{ width: value.length === 0 ? '1px' : `${(value.length + 0.5) * 2.5}rem` }}
                    />
                    {value.length === 0 ? <p>0</p> : <div className="text-xl font-semibold mx-[1vw]">{token.ticker}</div>}

                </div>
                <div className="flex flex-row justify-center items-center text-xl font-medium opacity-50 w-full h-full">
                    <p className="mr-[0.1vw]">$</p>
                    <p className="mx-[0.1vw]">{123}</p>
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
                            className={`text-lg rounded-2xl shadow-md mx-2 ${(isActive === index || value === item.value) && 'bg-purple-200 hover:bg-purple-200 opacity-100'}`}>
                            <div className="flex flex-row">
                                <p className="mr-[0.1vw]">{item.name}</p>
                                <p className="font-semibold ml-[0.1vw]">{token.ticker}</p>
                            </div>
                        </Button>
                    )
                })}
            </CardFooter>
        </Card>
    )
}