'use client'
import { useState, Dispatch, SetStateAction } from 'react';
import Image from "next/image";
import DialogItem from '@/components/exchange/DialogItem';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardFooter } from '@/components/ui/card'
import { HeightIcon } from "@radix-ui/react-icons";
import { BalancesType } from '@/lib/type';

interface Props {
    tokenOne: BalancesType | undefined;
    tokenTwo: BalancesType | undefined;
    tokenBalances: BalancesType[] | [];
    setTokenOne: Dispatch<SetStateAction<BalancesType | undefined>>;
    setTokenTwo: Dispatch<SetStateAction<BalancesType | undefined>>;
}

const listOptions = [
    { name: 'Market' },
    { name: '+1%' },
    { name: '+5%' },
    { name: '+10%' },
]

export default function LimitItem({ tokenOne, tokenTwo, tokenBalances, setTokenOne, setTokenTwo }: Props) {
    const [isActive, setIsActive] = useState<number | null>(0)
    const handleActive = (index: number) => {
        setIsActive(index)
    }
    const handleSwitchTokens = () => {
        const one = tokenOne
        const two = tokenTwo
        setTokenOne(two)
        setTokenTwo(one)
    }

    return (
        <div className="select-none my-[0.5vh]">
            <Card className='border-none outline-none'>
                <CardHeader className="flex flex-row justify-between items-center py-0">
                    <div className="flex flex-row justify-start items-start text-md">
                        <div className="mr-1">When 1</div>
                        <div className="mr-1 font-bold">
                            <DialogItem tokenBalances={tokenBalances} setToken={setTokenOne}>
                                <Image src={tokenOne?.token.img || "/image/default-token.png"} alt={tokenOne?.token.name || "token"} width="20" height="20" className="mr-1" />
                                {tokenOne?.token.ticker}
                            </DialogItem>
                        </div>
                        <div className="mr-1">is worth</div>
                    </div>
                    <div className="flex flex-row justify-end items-center">
                        <Button onClick={handleSwitchTokens} variant="secondary">
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
                            <DialogItem tokenBalances={tokenBalances} setToken={setTokenTwo}>
                                <div className="flex flex-row justify-center items-center w-full h-full">
                                    <Image src={tokenTwo?.token.img || "/image/default-token.png"} alt={tokenTwo?.token.name || "token"} width="15" height="15" />
                                    <p className="text-xl font-semibold mx-[0.3vw]">{tokenTwo?.token.ticker}</p>
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