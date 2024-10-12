'use client'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useBalance } from "wagmi";
import { setBalances } from "@/redux/features/wallet/walletSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Address, Token } from "@/lib/type"

interface Props {
    address: Address | undefined;
    token: Token;
    isETH?: boolean;
}

export default function TokenBalance({ address, token, isETH = false }: Props) {
    const dispatch = useDispatch()
    const { data: balance } = useBalance({
        address,
        token: isETH ? undefined : token.address
    })
    useEffect(() => {
        if (!!balance) {
            const newBalance = { ...balance, value: Number(balance?.value) }
            dispatch(setBalances({ token, balance: newBalance }))
        }
    }, [balance])

    return (
        <>
            {(balance && balance?.value.toString() !== '0') &&
                <div className="flex flex-row justify-between text-lg w-full h-[3.5vw]">
                    <div className="flex flex-row justify-start items-center">
                        <Avatar className="ml-[0.5vw]">
                            <AvatarImage src={token.img} />
                            <AvatarFallback>{token.ticker}</AvatarFallback>
                        </Avatar>
                        <p className="flex justify-start font-semibold mx-[0.3vw]">{token.name}</p>
                    </div>
                    <div className="flex flex-row justify-end items-center">
                        <p className="flex justify-end mx-[0.3vw]">{balance.formatted}</p>
                        <p className="font-semibold mr-[0.5vw]">{token.ticker}</p>
                    </div>
                </div>
            }
        </>
    )
}