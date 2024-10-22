'use client'
import { useRef, Dispatch, SetStateAction } from 'react';
import Image from "next/image";
import { Card, CardHeader, CardFooter, CardDescription } from '@/components/ui/card'
import DialogItem from '@/components/exchange/DialogItem';
import { CaretDownIcon } from "@radix-ui/react-icons";
import { TokenBalancesType } from "@/lib/type";

interface Props {
    title: string;
    isDisabled?: boolean;
    tokenBalance: TokenBalancesType | undefined;
    tokenBalances: TokenBalancesType[] | [];
    setToken: Dispatch<SetStateAction<TokenBalancesType | undefined>>;

}

export default function TradeItem({ isDisabled = false, title, tokenBalance, tokenBalances, setToken }: Props) {
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
                        disabled={isDisabled}
                        ref={ref}
                        type='number'
                        placeholder='0'
                        className="appearance-none bg-transparent border-none outline-none focus:caret-black-500 w-[70%] h-full text-5xl font-medium" />
                    <div className='flex justify-center items-center w-[18%] h-full'>
                        <div className='flex justify-center items-end w-full h-full'>
                            <DialogItem tokenBalances={tokenBalances} setToken={setToken}>
                                <div className="flex flex-row justify-around items-center hover:bg-secondary/80 rounded-xl shadow-lg w-full h-full">
                                    <Image src={tokenBalance?.info.img || "/image/default-token.png"} alt={tokenBalance?.info.name || "token name"} width="20" height="20" />
                                    <p className="text-xl font-semibold">{tokenBalance?.info.symbol}</p>
                                    <CaretDownIcon className="w-[20px] h-[20px]" />
                                </div>
                            </DialogItem>
                        </div>
                    </div>
                </div>
                <CardFooter className="flex justify-end items-center">
                    <CardDescription className="flex flex-row justify-end items-center w-[35%] pr-[1vw]">Balance: {tokenBalance?.balance?.formatted}</CardDescription>
                </CardFooter>
            </Card>
        </div>
    )
}