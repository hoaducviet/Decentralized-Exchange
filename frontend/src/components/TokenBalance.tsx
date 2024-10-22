import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TokenBalancesType } from "@/lib/type"

interface Props {
    tokenBalance: TokenBalancesType
}

export default function TokenBalance({ tokenBalance }: Props) {
    return (
        <>
            <div className="cursor-pointer flex flex-row justify-between hover:bg-secondary/80 text-md w-full h-[3vw] px-[1vw]">
                <div className=" flex flex-row justify-start items-center w-[55%]">
                    <Avatar className="w-[1.5vw] h-[1.5vw]">
                        <AvatarImage src={tokenBalance.info.img} className="z-1"/>
                        <AvatarFallback>{tokenBalance.info.symbol}</AvatarFallback>
                    </Avatar>
                    <p className="flex justify-start font-semibold mx-[0.3vw]">{tokenBalance.info.name}</p>
                </div>
                <div className="flex flex-row justify-end items-center w-[45%]">
                    <div className="flex justify-end mx-[0.5vw]">{tokenBalance?.balance?.formatted}</div>
                    <div className="flex justify-start font-semibold text-md w-[20%] mr-[1vw]">{tokenBalance.info.symbol}</div>
                </div>
            </div>

        </>
    )
}