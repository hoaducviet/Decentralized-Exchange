'use client'

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CaretDownIcon } from "@radix-ui/react-icons";
import tokenList from "@/assets/token/tokenList.json";
import tokenETH from "@/assets/token/tokenETH.json";
import { type Token } from "@/lib/type";

const tokensErc20: Token[] = tokenList as Token[];
const eth: Token = tokenETH as Token;
const tokens: Token[] = [eth, ...tokensErc20];

interface Props {
    isButton?: boolean;
}

export default function DialogItem({ isButton = true }: Props) {

    return (
        <div className="flex justify-center items-center w-full h-full px-[2vw]">
            <Dialog>
                <DialogTrigger className="flex flex-row justify-around items-center w-full h-full">
                    {isButton ? (
                        <div className="flex flex-row justify-around items-center bg-secondary/80 hover:bg-secondary/80 rounded-xl shadow-lg w-full h-full">
                            <Image src={tokens[0].img} alt={tokens[0].name} width="24" height="24" />
                            <p className="text-2xl font-semibold">{tokens[0].ticker}</p>
                            <CaretDownIcon className="w-[24px] h-[24px]" />
                        </div>
                    ) : (
                        <div className="flex flex-row justify-center items-center shadow-xl rounded-2xl w-full h-full">
                            <Image src={tokens[0].img} alt={tokens[0].name} width="20" height="20" />
                            <p className="text-xl font-semibold mx-[0.3vw]">{tokens[0].ticker}</p>
                        </div>
                    )}
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