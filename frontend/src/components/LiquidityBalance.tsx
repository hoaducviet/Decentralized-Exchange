import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LiquidBalancesType } from "@/lib/type"

interface Props {
    liquidityBalances: LiquidBalancesType[] | undefined
}

export default function LiquidityBalance({ liquidityBalances }: Props) {

    return (
        <> {
            liquidityBalances && liquidityBalances.length ? <>{liquidityBalances.map((balance, index) => {
                if (parseFloat(balance.balance?.formatted || "") === 0) {
                    return <div key={index}></div>
                }
                return (
                    <div key={index} className="cursor-pointer hover:bg-secondary/80 flex flex-row justify-between text-md w-full h-[3vw] px-[1vw]">
                        <div className="flex flex-row justify-start items-center w-[55%]">
                            <Avatar className="w-[1.5vw] h-[1.5vw] border border-black">
                                <div className="realtive flex">
                                    <AvatarImage src={balance.info.token1?.img}
                                        className="absolute w-full h-full object-cover"
                                        style={{ clipPath: "inset(0 50% 0 0)" }} />
                                    <AvatarImage src={balance.info.token2.img}
                                        className="absolute w-full h-full object-cover"
                                        style={{ clipPath: "inset(0 0 0 50%)" }} />
                                </div>
                                <AvatarFallback>{balance.info.name}</AvatarFallback>
                            </Avatar>
                            <p className="flex justify-start font-semibold mx-[0.3vw]">{balance.info.name}</p>
                        </div>
                        <div className="flex flex-row justify-end items-center w-[45%]">
                            <p className="flex justify-end mx-[0.5vw]">{balance.balance?.formatted}</p>
                            <p className="flex justify-start font-semibold w-[20%] mr-[1vw]">LPT</p>
                        </div>
                    </div>
                )
            })}</> : <div className="flex flex-row justify-center items-start w-full my-[2vw]">Please add liquidity for award!</div>
        }
        </>
    )
}