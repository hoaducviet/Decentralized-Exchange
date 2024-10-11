'use client'
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { HeightIcon } from "@radix-ui/react-icons"
import { Token } from '@/lib/type'


interface Props {
    token: Token
}

export default function TranferItem({ token }: Props) {
    const ref = useRef<HTMLInputElement>(null)
    const [value, setValue] = useState<string>("")
    const handleClick = () => {
        if (ref.current) {
            ref.current.focus()
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    return (
        <Card onClick={handleClick} className='w-full h-full select-none outline-none border-none'>
            <CardHeader className='flex flex-row justify-between items-center w-full'>
                <CardDescription>You are sending</CardDescription>
                <Button variant="secondary">
                    <HeightIcon />
                </Button>
            </CardHeader>
            <CardContent className='flex flex-col justify-center items-center w-full'>
                <div className='flex flex-row justify-center items-center w-full text-5xl'>
                    <p>$</p>
                    <input
                        ref={ref}
                        type='number'
                        step='any'
                        value={parseFloat(value)}
                        onChange={handleChange}
                        className="appearance-none text-center border-none outline-none focus:caret-black-500 max-w-[80%] text-5xl font-medium"
                        style={{ width: `${value.length + 1}ch` }}
                        placeholder='0'
                    />
                </div>
                <div className='opacity-50 text-xl'>0 {token.ticker}</div>
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    )
}