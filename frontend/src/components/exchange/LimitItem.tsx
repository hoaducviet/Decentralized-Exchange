'use client'

import { useRef } from 'react';
import { Card, CardHeader, CardFooter, CardDescription } from '@/components/ui/card'
import DialogItem from '@/components/exchange/DialogItem';

interface Props {
    title: string;

}

export default function LimitItem() {

    const ref = useRef<HTMLInputElement>(null)
    const handleClick = () => {
        if (ref.current) {
            ref.current.focus()
        }
    }

    return (
        <div onClick={handleClick} className="select-none my-[0.5vh] border-none outline-none">
            <Card className='border-none outline-none '>
                <CardHeader>
                    <CardDescription></CardDescription>
                </CardHeader>
                <div className="flex flex-row justify-center items-center mx-[5%]">
                    <input
                        ref={ref}
                        type='number'
                        placeholder='0'
                        className="appearance-none bg-transparent border-none outline-none focus:caret-black-500 w-[70%] h-full text-5xl font-medium" />
                    <div className='flex justify-center items-center w-[30%] h-full'>
                        <DialogItem />
                    </div>
                </div>
                <CardFooter className="flex justify-end items-center">
                    <CardDescription className="flex justify-center items-center w-[20%]">Balance: 0</CardDescription>
                </CardFooter>
            </Card>
        </div>
    )
}