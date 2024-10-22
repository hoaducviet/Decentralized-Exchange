'use client'
import { useRef, useState, Dispatch, SetStateAction } from "react"
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
}

export default function BuyItem({ tokenBalance, tokenBalances, setToken }: Props) {
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
    const handleActive = (index: number, item: Price) => {
        setIsActive(index)
        setValue(item.value)
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
                        value={parseFloat(value)}
                        onChange={handleChange}
                        className="appearance-none bg-transparent text-start border-none outline-none focus:caret-black-500 max-w-[80%] font-medium"
                        style={{ width: value.length === 0 ? '1px' : `${(value.length + 0.5) * 2.5}rem` }}
                    />
                    {value.length === 0 ? <p>0</p> : <></>}
                </div>
                <DialogItem tokenBalances={tokenBalances} setToken={setToken}>
                    <div className="flex flex-row justify-center items-center text-xl font-medium w-full h-full">
                        <Image src={tokenBalance?.info.img || "/image/default-token.png"} alt={tokenBalance?.info.name || "token"} width="20" height="24" className="mr-[0.1vw]" />
                        <p className="opacity-50 mx-[0.1vw]">{123}</p>
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
                            className={`text-lg rounded-2xl shadow-md mx-2 ${(isActive === index || value === item.value) && 'bg-purple-200 hover:bg-purple-200 opacity-100'}`}>
                            {item.name}
                        </Button>
                    )
                })}
            </CardFooter>
        </Card>
    )
}