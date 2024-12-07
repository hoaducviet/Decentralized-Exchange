import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TokenBalancesType } from "@/lib/type"

interface Props {
    tokenBalances: TokenBalancesType[] | undefined;
}

export default function TokenBalance({ tokenBalances }: Props) {
    return (
        <>
            {tokenBalances && tokenBalances.length ? <>{tokenBalances.map(((balance, index) => {
                if (parseFloat(balance.balance?.formatted || "") === 0) {
                    return <div key={index}></div>
                }
                return (
                    <div key={index} className="cursor-pointer flex flex-row justify-between hover:bg-secondary/80 text-md w-full h-[3vw] px-[1vw]">
                        <div className=" flex flex-row justify-start items-center w-[55%]">
                            <Avatar className="w-[1.5vw] h-[1.5vw]">
                                <AvatarImage src={balance.info.img} className="z-1" />
                                <AvatarFallback>{balance.info.symbol}</AvatarFallback>
                            </Avatar>
                            <p className="flex justify-start font-semibold mx-[0.3vw]">{balance.info.name}</p>
                        </div>
                        <div className="flex flex-row justify-end items-center w-[45%]">
                            <div className="flex justify-end mx-[0.5vw]">{balance?.balance?.formatted}</div>
                            <div className="flex justify-start font-semibold text-md w-[20%] mr-[1vw]">{balance.info.symbol}</div>
                        </div>
                    </div>
                )
            }))}</> : <div className="flex flex-row justify-center items-start w-full my-[2vw]">Please deposit usd for exchange</div>
            }
        </>
    )
}