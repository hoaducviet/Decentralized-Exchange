import PoolBox from "@/components/exchange/PoolBox";
import PoolBalances from "@/components/exchange/PoolBalances";

export default function Pool() {
    return (
        <div className=" flex flex-col justify-start items-center w-full h-full">
            <div className="flex flex-col justify-start items-center w-[50vw] m-[5vw]">
                <div className="flex flex-row justify-start items-center w-full">
                    <p className="text-3xl font-semibold opacity-80">Add Liquidity</p>
                </div>
                <div className="flex w-full">
                    <PoolBox />
                </div>
                <div className="flex w-full">
                    <PoolBalances />
                </div>
            </div>
        </div>
    )
}