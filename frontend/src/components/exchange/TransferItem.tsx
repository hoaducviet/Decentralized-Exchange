'use client'
import { useRef, useState, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { HeightIcon } from "@radix-ui/react-icons"
import { Token } from '@/lib/type'

interface Props {
    token1: Token | undefined;
    token2: Token | undefined;
    amount1: string;
    amount2: string;
    setAmount: Dispatch<SetStateAction<string>>;
    handleSwitchTokens: () => void;
}

export default function TransferItem({ token1, token2, amount1, amount2, setAmount, handleSwitchTokens }: Props) {
    const ref = useRef<HTMLInputElement>(null)
    const [isToken, setIsToken] = useState<boolean>(false)
    const value1 = amount1.includes(".") ? amount1.slice(0, amount1.indexOf(".") + 7) : amount1
    const value2 = amount2.includes(".") ? amount2.slice(0, amount2.indexOf(".") + 7) : amount2
    const handleClick = () => {
        if (ref.current) {
            ref.current.focus()
        } 
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value)
    }
    const handleSwitch = () => {
        setIsToken(!isToken)
    }

    return (
        <Card onClick={handleClick} className='w-full h-full select-none outline-none border-none'>
            <CardHeader className='flex flex-row justify-between items-center w-full'>
                <CardDescription>You are sending</CardDescription>
                <Button onClick={() => {
                    handleSwitch()
                    handleSwitchTokens()
                }} variant="secondary">
                    <HeightIcon />
                </Button>
            </CardHeader>
            <CardContent className='flex flex-col justify-center items-center w-full'>
                {isToken ?
                    <div className='flex flex-col justify-center items-center w-full'>
                        <div className='flex flex-row justify-center items-center w-full text-5xl space-x-[0.05vw]'>
                            <p>$</p>
                            <input
                                ref={ref}
                                type='number'
                                step='any'
                                value={value1}
                                onChange={handleChange}
                                className="appearance-none bg-transparent text-start border-none outline-none focus:caret-black-500 max-w-[80%] font-medium"
                                style={{ width: value1.length === 0 ? '1px' : `${(value1.length + 1) * 1.5}rem` }}
                            />
                            {value1 === "" ? <p>0</p> : <></>}
                        </div>
                        <div className='flex flex-row opacity-50 text-xl space-x-[0.2vw]'>{value2.length === 0 ? <p>0</p> : <></>} <p>{value2}</p> <p>{token2?.symbol}</p></div>
                    </div>
                    : <div className='flex flex-col justify-center items-center w-full'>
                        <div className='flex flex-row justify-center items-center w-full text-5xl space-x-[0.3vw]'>
                            <input
                                ref={ref}
                                type='number'
                                step='any'
                                value={value1}
                                onChange={handleChange}
                                placeholder='0'
                                className="appearance-none bg-transparent text-start border-none outline-none focus:caret-black-500 max-w-[80%] font-medium"
                                style={{ width: value1.length === 0 ? '1px' : `${(value1.length + 1) * 1.5}rem` }}
                            />
                            {value1.length === 0 ? <p>0</p> : <></>}
                            <p className='opacity-80 text-3xl font-medium'>{token1?.symbol}</p>
                        </div>
                        <div className='flex flex-row opacity-50 text-xl space-x-[0.2vw]'>{value2.length === 0 ? <p>0</p> : <></>} <p>{value2}</p> <p>{token2?.symbol}</p></div>
                    </div>
                }
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    )
}