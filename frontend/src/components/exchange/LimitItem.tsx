'use client'
import { useState, Dispatch, SetStateAction } from 'react';
import Image from "next/image";
import DialogItem from '@/components/exchange/DialogItem';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardFooter } from '@/components/ui/card'
import { HeightIcon } from "@radix-ui/react-icons";
import { Token } from '@/lib/type';

interface Props {
    tokenOne: Token | undefined;
    tokenTwo: Token | undefined;
    tokens: Token[] | [];
    handleSwitchTokens: () => void;
    setTokenOne: Dispatch<SetStateAction<Token | undefined>>;
    setTokenTwo: Dispatch<SetStateAction<Token | undefined>>;
    setPercent: Dispatch<SetStateAction<string>>;
    price: string;
}
 
type list = {
    name: string;
    value: string;
}

const listOptions: list[] = [
    { name: 'Market', value: "1.0" },
    { name: '+1%', value: "1.01" },
    { name: '+5%', value: "1.05" },
    { name: '+10%', value: "1.1" },
] as list[];

export default function LimitItem({ tokenOne, tokenTwo, tokens, setTokenOne, setTokenTwo, handleSwitchTokens, price, setPercent }: Props) {
    const [isActive, setIsActive] = useState<number>(0)
    const handleActive = (index: number) => {
        setIsActive(index)
        setPercent(listOptions[index].value)
    }

    return (
        <div className="select-none my-[0.5vh]">
            <Card className='border-none outline-none'>
                <CardHeader className="flex flex-row justify-between items-center py-0">
                    <div className="flex flex-row justify-start items-start text-md">
                        <div className="mr-1">When 1</div>
                        <div className="mr-1 font-bold">
                            <DialogItem tokens={tokens} setToken={setTokenOne}>
                                <Image src={tokenOne?.img || "/image/default-token.png"} priority={true} alt={tokenOne?.name || "token"} width="20" height="20" className="mr-1" />
                                {tokenOne?.symbol}
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
                    <div className="bg-transparent border-none outline-none focus:caret-black-500 w-[70%] h-[3vw] text-5xl font-medium">
                        {price}
                    </div>
                    <div className='flex justify-center items-center w-[30%] h-full'>
                        <div className='flex flex-row justify-center shadow-xl rounded-2xl items-center w-[50%] h-full'>
                            <DialogItem tokens={tokens} setToken={setTokenTwo}>
                                <div className="flex flex-row justify-center items-center w-full h-full">
                                    <Image src={tokenTwo?.img || "/image/default-token.png"} priority={true} alt={tokenTwo?.name || "token"} width="15" height="15" />
                                    <p className="text-xl font-semibold mx-[0.3vw]">{tokenTwo?.symbol}</p>
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
                                className={`flex justify-center items-center rounded-2xl shadow-md  mr-2 ${isActive === index && 'bg-purple-200 dark:bg-white/20'}`}
                            >{item.name}</Button>
                        )
                    })}
                </CardFooter>
            </Card>
        </div>
    )
}