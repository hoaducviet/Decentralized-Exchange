'use client'
import { useState } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import DialogItem from '@/components/exchange/DialogItem';
import { Card, CardHeader, CardFooter } from '@/components/ui/card'
import { HeightIcon } from "@radix-ui/react-icons";
import tokenList from "@/assets/token/tokenList.json";
import tokenETH from "@/assets/token/tokenETH.json";
import { type Token } from '@/lib/type';

const tokensErc20: Token[] = tokenList as Token[];
const eth: Token = tokenETH as Token;
const tokens: Token[] = [eth, ...tokensErc20];

interface Props {
    token: Token;

}

const listOptions = [
    { name: 'Market' },
    { name: '+1%' },
    { name: '+5%' },
    { name: '+10%' },
]

export default function LimitItem({ token }: Props) {
    const [isActive, setIsActive] = useState<number | null>(0)
    const handleActive = (index: number) => {
        setIsActive(index)
    }

    return (
        <div className="select-none my-[0.5vh]">
            <Card className='border-none outline-none'>
                <CardHeader className="flex flex-row justify-between items-center py-0">
                    <div className="flex flex-row justify-start items-start text-md">
                        <div className="mr-1">When 1</div>
                        <Image src={token.img} alt={token.name} width="20" height="20" className="mr-1" />
                        <div className="mr-1 font-bold">{token.ticker}</div>
                        <div className="mr-1">is worth</div>
                    </div>
                    <div className="flex flex-row justify-end items-center">
                        <Button variant="secondary">
                            <HeightIcon />
                        </Button>
                    </div>
                </CardHeader>
                <div className="flex flex-row justify-center items-center mx-[5%] pb-[1%]">
                    <div className="bg-transparent border-none outline-none focus:caret-black-500 w-[70%] h-full text-5xl font-medium">
                        123.4353
                    </div>
                    <div className='flex justify-center items-center w-[30%] h-full'>
                        <div className='flex flex-row justify-center shadow-xl rounded-2xl items-center w-[50%] h-full'>
                            <DialogItem>
                                <div className="flex flex-row justify-center items-center w-full h-full">
                                    <Image src={tokens[0].img} alt={tokens[0].name} width="15" height="15" />
                                    <p className="text-xl font-semibold mx-[0.3vw]">{tokens[0].ticker}</p>
                                </div>
                            </DialogItem>
                        </div>
                    </div>
                </div>
                <CardFooter className="flex justify-start items-center pb-[2%]">
                    {listOptions.map((item, index) => {
                        return (
                            <Button
                                key={index}
                                variant="ghost"
                                onClick={() => handleActive(index)}
                                className={`flex justify-center items-center rounded-2xl shadow-md  mr-2 ${isActive === index && 'bg-purple-200 hover:bg-purple-200'}`}
                            >{item.name}</Button>
                        )
                    })}
                </CardFooter>
            </Card>
        </div>
    )
}