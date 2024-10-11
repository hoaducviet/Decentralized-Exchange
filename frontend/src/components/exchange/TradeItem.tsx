'use client'

import { useRef } from 'react';
import Image from "next/image";
import { Card, CardHeader, CardFooter, CardDescription } from '@/components/ui/card'
import DialogItem from '@/components/exchange/DialogItem';
import { CaretDownIcon } from "@radix-ui/react-icons";
import tokenList from "@/assets/token/tokenList.json";
import tokenETH from "@/assets/token/tokenETH.json";
import { Children, Token } from "@/lib/type";

const tokensErc20: Token[] = tokenList as Token[];
const eth: Token = tokenETH as Token;
const tokens: Token[] = [eth, ...tokensErc20];

interface Props {
    title: string;

}

export default function TradeBoxItem({ title }: Props) {
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
                    <CardDescription>{title}</CardDescription>
                </CardHeader>
                <div className="flex flex-row justify-center items-center mx-[5%]">
                    <input
                        ref={ref}
                        type='number'
                        placeholder='0'
                        className="appearance-none bg-transparent border-none outline-none focus:caret-black-500 w-[70%] h-full text-5xl font-medium" />
                    <div className='flex justify-center items-center w-[30%] h-full'>
                        <div className='flex justify-center items-center w-full h-full'>
                            <DialogItem >
                                <div className="flex flex-row justify-around items-center bg-secondary/80 hover:bg-secondary/80 rounded-xl shadow-lg w-full h-full">
                                    <Image src={tokens[0].img} alt={tokens[0].name} width="24" height="24" />
                                    <p className="text-2xl font-semibold">{tokens[0].ticker}</p>
                                    <CaretDownIcon className="w-[24px] h-[24px]" />
                                </div>
                            </DialogItem>
                        </div>
                    </div>
                </div>
                <CardFooter className="flex justify-end items-center">
                    <CardDescription className="flex justify-center items-center w-[20%]">Balance: 0</CardDescription>
                </CardFooter>
            </Card>
        </div>
    )
}