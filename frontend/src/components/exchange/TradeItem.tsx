'use client'
import { useRef, Dispatch, SetStateAction } from 'react';
import { useAccount } from 'wagmi';
import Image from "next/image";
import DialogItem from '@/components/exchange/DialogItem';
import { Card, CardHeader, CardFooter, CardDescription } from '@/components/ui/card'
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Token } from "@/lib/type";

interface Props {
    title: string;
    isDisabled?: boolean;
    token: Token | undefined;
    tokens: Token[];
    setToken: Dispatch<SetStateAction<Token | undefined>>;
    amount: string;
    setAmount: Dispatch<SetStateAction<string>>; 
    balance?: string;
}

export default function TradeItem({ isDisabled = false, title, token, tokens, setToken, amount, setAmount, balance = "0" }: Props) {
    const ref = useRef<HTMLInputElement>(null)
    const { isConnected } = useAccount()
    const handleClick = () => { 
        if (ref.current) {
            ref.current.focus()
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isDisabled) {
            const value = e.target.value.trim()
            setAmount(value)
        }
    }

    return (
        <div onClick={handleClick} className="select-none my-[0.5vh] border-none outline-none">
            <Card className='border-none outline-none '>
                <CardHeader>
                    <CardDescription>{title}</CardDescription>
                </CardHeader>
                <div className="flex flex-row justify-center items-center mx-[5%]">
                    <input
                        disabled={isDisabled}
                        onChange={handleChange}
                        ref={ref}
                        type='number'
                        step='any'
                        placeholder='0'
                        value={amount.includes(".") ? amount.slice(0, amount.indexOf(".") + 7) : amount}
                        className="appearance-none bg-transparent border-none outline-none focus:caret-black-500 w-[70%] h-full text-5xl font-medium" />
                    <div className='flex justify-center items-center w-[18%] h-full'>
                        <div className='flex justify-center items-end w-full h-full'>
                            {token?.symbol !== 'USD' ?
                                <DialogItem tokens={tokens} setToken={setToken}>
                                    <div className="flex flex-row justify-around items-center hover:bg-secondary/80 rounded-xl shadow-lg w-full h-full">
                                        <Image src={token?.img || "/image/default-token.png"} priority={true} alt={token?.name || "token name"} width="20" height="20" />
                                        <p className="text-xl font-semibold">{token?.symbol}</p>
                                        <CaretDownIcon className="w-[20px] h-[20px]" />
                                    </div>
                                </DialogItem>
                                :
                                <div className="flex flex-row justify-start items-center space-x-[1vw] w-full h-full mx-[0.5vw]">
                                    <Image src={token?.img || "/image/default-token.png"} priority={true} alt={token?.name || "token name"} width="20" height="20" />
                                    <p className="text-xl font-semibold">{token?.symbol}</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <CardFooter className="flex flex-row justify-end items-center h-[3vw]">
                    {isConnected &&
                        <CardDescription className="flex flex-row justify-start items-center w-[25%] pr-[1vw]">Balance: {balance}</CardDescription>
                    }
                </CardFooter>
            </Card>
        </div>
    )
}