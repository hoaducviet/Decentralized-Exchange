'use client'
import { useRef, useState, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { HeightIcon } from "@radix-ui/react-icons"
import { TokenBalancesType } from '@/lib/type'

interface Props {
    tokenBalance: TokenBalancesType | undefined;
    amount: string;
    setAmount: Dispatch<SetStateAction<string>>;
}

export default function TransferItem({ tokenBalance, amount, setAmount }: Props) {
    const ref = useRef<HTMLInputElement>(null)
    const [isToken, setIsToken] = useState<boolean>(false)
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
                <Button onClick={handleSwitch} variant="secondary">
                    <HeightIcon />
                </Button>
            </CardHeader>
            <CardContent className='flex flex-col justify-center items-center w-full'>
                {isToken ?
                    <div className='flex flex-col justify-center items-center w-full'>
                        <div className='flex flex-row justify-center items-center w-full text-5xl'>
                            <p>$</p>
                            <input
                                ref={ref}
                                type='number'
                                step='any'
                                value={amount.includes(".") ? amount.slice(0, amount.indexOf(".") + 7) : amount}
                                onChange={handleChange}
                                className="appearance-none bg-transparent text-start border-none outline-none focus:caret-black-500 max-w-[80%] font-medium"
                                style={{ width: amount.length === 0 ? '1px' : `${(amount.length + 1) * 1.5}rem` }}
                            />
                            {amount.length === 0 ? <p>0</p> : <></>}
                        </div>
                        <div className='opacity-50 text-xl'>0 {tokenBalance?.info.symbol}</div>
                    </div>
                    : <div className='flex flex-col justify-center items-center w-full'>
                        <div className='flex flex-row justify-center items-center w-full text-5xl space-x-[0.3vw]'>
                            <input
                                ref={ref}
                                type='number'
                                step='any'
                                value={amount.includes(".") ? amount.slice(0, amount.indexOf(".") + 7) : amount}
                                onChange={handleChange}
                                placeholder='0'
                                className="appearance-none bg-transparent text-start border-none outline-none focus:caret-black-500 max-w-[80%] font-medium"
                                style={{ width: amount.length === 0 ? '1px' : `${(amount.length + 1) * 1.5}rem` }}
                            />
                            {amount.length === 0 ? <p>0</p> : <></>}
                            <p className='opacity-80 text-3xl font-medium'>{tokenBalance?.info.symbol}</p>
                        </div>
                        <div className='opacity-50 text-xl'>$ 0 USD</div>
                    </div>
                }
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    )
}