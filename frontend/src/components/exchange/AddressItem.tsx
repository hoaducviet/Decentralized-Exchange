'use client'
import { useRef } from 'react'
import { Card, CardHeader, CardDescription, CardContent } from '@/components/ui/card'


export default function AddressItem() {
    const ref = useRef<HTMLInputElement>(null)
    const handleClick = () => {
        if (ref.current) {
            ref.current.focus()
        }
    }

    return (
        <Card onClick={handleClick} className='flex flex-col select-none w-full border-none outline-none'>
            <CardHeader className='py-[0.8vh]'>
                <CardDescription>To</CardDescription>
            </CardHeader>
            <CardContent className='py-[0.8vh]'>
                <input
                    ref={ref}
                    type='text'
                    placeholder='Wallet address'
                    className="appearance-none bg-transparent border-none outline-none focus:caret-black-500 w-full h-full text-lg font-medium" />
            </CardContent>
        </Card>
    )
}