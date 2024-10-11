'use client'

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CaretDownIcon } from "@radix-ui/react-icons";
import tokenList from "@/assets/token/tokenList.json";
import tokenETH from "@/assets/token/tokenETH.json";
import { Children, Token } from "@/lib/type";

const tokensErc20: Token[] = tokenList as Token[];
const eth: Token = tokenETH as Token;
const tokens: Token[] = [eth, ...tokensErc20];

interface Props {
    isButton?: boolean;
    children: Children
}

export default function DialogItem({ isButton = true, children }: Props) {

    return (
        <div className="flex justify-center items-center w-full h-full px-[2vw]">
            <Dialog>
                <DialogTrigger className="flex flex-row justify-around items-center w-full h-full">
                    {children}
                </DialogTrigger>
                <DialogContent className="w-[25vw] h-[70vh] px-0 pb-0">
                    <DialogHeader className="bg-fixed w-full p-[2%]">
                        <DialogTitle>Select a token</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col w-full h-full overflow-auto">
                        {tokens.length && tokens.map((token) => {
                            return (
                                <Button variant="ghost" key={token.address} className="flex flex-row w-full h-[6.5vh] my-[0.2vh]">
                                    <Image src={token.img} alt={token.name} width="48" height="48" className="justify-center" />
                                    <div className="flex flex-col justify-center items-start mx-4 w-full h-full">
                                        <p className="text-xl font-semibold">{token.name}</p>
                                        <p>{token.ticker}</p>
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