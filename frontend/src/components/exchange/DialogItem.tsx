'use client'
import { Dispatch, SetStateAction, useState } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogDescription, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Children, Token } from "@/lib/type";

interface Props {
    children: Children;
    tokens: Token[] | [];
    setToken: Dispatch<SetStateAction<Token | undefined>>;
}

export default function DialogItem({ children, tokens, setToken }: Props) {
    const [open, setOpen] = useState(false)
    const handleClick = (token: Token) => {
        setToken(token);
        setOpen(false)
    }

    return (
        <div className="flex justify-center items-center w-full h-full">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="flex flex-row justify-around items-center w-full h-full">
                    {children}
                </DialogTrigger>
                <DialogContent className="w-[23vw] max-h-[50vw] px-0 pb-0">
                    <DialogHeader className="bg-fixed w-full p-[2%] px-[1vw]">
                        <DialogTitle>Select a token</DialogTitle>
                        <DialogDescription>Please choose a token for exchange!</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col w-full h-full overflow-x-auto mb-[2vw]">
                        {tokens.length && tokens.map((token) => {
                            return (
                                <Button onClick={() => handleClick(token)} variant="ghost" key={token.address} className="flex flex-row w-full h-[3vw]  px-[1vw]">
                                    <Image src={token.img} alt={token.name} priority={true} width="36" height="36" className="justify-center" />
                                    <div className="flex flex-col justify-center items-start mx-4 w-full h-full">
                                        <p className="text-xl font-semibold">{token.name}</p>
                                        <p>{token.symbol}</p>
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