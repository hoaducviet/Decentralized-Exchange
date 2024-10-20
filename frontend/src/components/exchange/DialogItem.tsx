'use client'
import { Dispatch, SetStateAction, useState } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Children, BalancesType } from "@/lib/type";

interface Props {
    children: Children;
    tokenBalances: BalancesType[] | [];
    setToken: Dispatch<SetStateAction<BalancesType | undefined>>;
}

export default function DialogItem({ children, tokenBalances, setToken }: Props) {
    const [open, setOpen] = useState(false)
    const handleClick = (tokenBalance: BalancesType) => {
        setToken(tokenBalance);
        setOpen(false)
    }

    return (
        <div className="flex justify-center items-center w-full h-full">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="flex flex-row justify-around items-center w-full h-full">
                    {children}
                </DialogTrigger>
                <DialogContent className="w-[23vw] max-h-[50vw] px-0 pb-0">
                    <DialogHeader className="bg-fixed w-full p-[2%]">
                        <DialogTitle className="px-[1vw]">Select a token</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col w-full h-full overflow-auto">
                        {tokenBalances.length && tokenBalances.map((tokenBalance) => {
                            return (
                                <Button onClick={() => handleClick(tokenBalance)} variant="ghost" key={tokenBalance.token.address} className="flex flex-row w-full h-[3vw]  px-[1vw]">
                                    <Image src={tokenBalance.token.img} alt={tokenBalance.token.name} width="36" height="36" className="justify-center" />
                                    <div className="flex flex-col justify-center items-start mx-4 w-full h-full">
                                        <p className="text-xl font-semibold">{tokenBalance.token.name}</p>
                                        <p>{tokenBalance.token.symbol}</p>
                                    </div>
                                </Button>
                            )
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}