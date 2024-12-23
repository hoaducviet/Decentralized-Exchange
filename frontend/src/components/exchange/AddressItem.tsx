'use client'
import { useRef, Dispatch, SetStateAction } from 'react'
import { Card, CardHeader, CardDescription, CardContent } from '@/components/ui/card'

interface Props {
    address: string;
    setAddress: Dispatch<SetStateAction<string>>;
    isEmail?: boolean;
    
}

export default function AddressItem({ address, setAddress, isEmail = false }: Props) {
    const ref = useRef<HTMLInputElement>(null)
    const handleClick = () => {
        if (ref.current) {
            ref.current.focus()
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value)
    }

    return (
        <Card onClick={handleClick} className='flex flex-col select-none w-full border-none outline-none'>
            <CardHeader className='py-[0.8vh]'>
                <CardDescription>To</CardDescription>
            </CardHeader>
            <CardContent className='py-[0.8vh]'>
                <input
                    onChange={handleChange}
                    ref={ref}
                    type={isEmail ? "email" : 'text'}
                    value={address}
                    placeholder={isEmail ? 'Email address' : 'Wallet address'}
                    className="appearance-none bg-transparent border-none outline-none focus:caret-black-500 w-full h-full text-lg font-medium" />
            </CardContent>
        </Card>
    )
}