'use client'
import useAuthCheck from "@/hooks/useAuthCheck"
import { useGetTokenTransactionsAllQuery } from "@/redux/features/api/apiSlice"
import NFTsTopPrice from '@/components/nfts/NFTsTopPrice'
import { Card, CardTitle } from "@/components/ui/card";
import { calculateElapsedTime } from "@/utils/calculateElapsedTime"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { formatPrice } from "@/utils/formatPrice";
import { useGetDailyTVLQuery, useGetDailyVolumeQuery } from '@/redux/features/api/apiSlice'
import TVLChart from "@/components/chart/TvlChart";
import VolumeChart from "@/components/chart/VolumeChart";

const options = ['Time', 'Type', 'USD', 'Detail', 'Wallet']
export default function Admin() {
    useAuthCheck()
    const { data: volumes } = useGetDailyVolumeQuery()
    const { data: tvls } = useGetDailyTVLQuery()
    const { data: transactions, isFetching } = useGetTokenTransactionsAllQuery()
    const limitTransactions = transactions?.slice(0, 100)
    return (
        <div className="select-none flex flex-col justify-center items-center w-full px-[3vw] py-[1vw] space-y-[2vw]">
            <div className='w-full'>
                <NFTsTopPrice />
            </div>
            <div className="border-[1px] shadow-md rounded-2xl flex flex-row items-start space-x-[1vw] px-[1vw] w-full">
                <div className="w-[50%]">
                    <TVLChart tvls={tvls || []} />
                </div>
                <div className="w-[50%]">
                    <VolumeChart volumes={volumes || []} />
                </div>
            </div>
            <div className="w-full">
                <Card className="flex flex-col w-full rounded-2xl border-[1px] space-y-3 p-[2.5vw] shadow-md max-h-[86vh] overflow-y-auto">
                    <CardTitle className='text-2xl font-semibold'>Transactions</CardTitle>
                    {!isFetching && limitTransactions?.length && <>
                        <div className="w-full">
                            <div className="flex flex-row justify-between items-center text-md font-semibold opacity-70 px-3 h-[3vw]">
                                <div className="w-[15%] flex flex-col justify-start">{options[0]}</div>
                                <div className="w-[25%] flex flex-row justify-start">{options[1]}</div>
                                <div className="w-[20%] flex flex-row justify-start">{options[2]}</div>
                                <div className="w-[25%] flex flex-row justify-start">{options[3]}</div>
                                <div className="w-[20%] flex flex-row justify-end">{options[4]}</div>
                            </div>
                        </div>
                        <div className="flex flex-col border-t-[1px] max-h-[55vw] overflow-x-auto">
                            {limitTransactions?.map((item, index) => {
                                const wallet = item.from_wallet.slice(0, 6) + "..." + item.from_wallet.slice(38)
                                return (
                                    <div key={index}>

                                        <div className={`flex flex-row cursor-pointer hover:bg-secondary/80 dark:hover:bg-white/5 text-md font-medium items-center h-[3.5vw] w-full px-4 border-t-[0.2px] border-gray-300 border-opacity-20 ${index === limitTransactions.length - 1 ? 'rounded-b-2xl' : ''}`} >
                                            <div className="w-[15%] flex flex-col justify-start font-medium">{calculateElapsedTime(item.createdAt)}</div>
                                            <div className="w-[25%] flex flex-row items-center justify-start space-x-[0.3vw]">
                                                <div className="font-medium">{item.type.split(" ")[0]}</div>
                                                <div className="flex flex-row items-center space-x-[0.2vw]">
                                                    <Avatar className="w-[1vw] h-[1vw]">
                                                        <AvatarImage src={item.from_token_id?.img} alt="Token" />
                                                        <AvatarFallback>T</AvatarFallback>
                                                    </Avatar>
                                                    <div>{item.from_token_id?.symbol}</div>
                                                </div>
                                                {item.to_token_id && <>
                                                    <ArrowRightIcon width={20} height={20} />
                                                    <div className="flex flex-row items-center space-x-[0.2vw]">
                                                        <Avatar className="w-[1vw] h-[1vw]">
                                                            <AvatarImage src={item.to_token_id?.img} alt="Token" />
                                                            <AvatarFallback>T</AvatarFallback>
                                                        </Avatar>
                                                        <div>{item.to_token_id?.symbol}</div>
                                                    </div>
                                                </>}
                                            </div>
                                            <div className="w-[20%] flex flex-row justify-start">${formatPrice(parseFloat(item.price ?? ""))}</div>
                                            <div className="w-[25%] flex flex-row items-center space-x-[0.3vw]">
                                                <div>
                                                    <div className="flex flex-row items-center space-x-[0.2vw]">
                                                        <div className="font-medium">{item.amount_in?.slice(0, item.amount_in?.indexOf(".") + 7)}</div>
                                                        <div>{item.from_token_id?.symbol}</div>
                                                    </div>
                                                </div>
                                                {item.to_token_id && <>
                                                    <ArrowRightIcon width={20} height={20} />
                                                    <div className="flex flex-row items-center space-x-[0.2vw]">
                                                        <div className="font-medium">{item.amount_out?.slice(0, item.amount_out?.indexOf(".") + 7)}</div>
                                                        <div>{item.to_token_id?.symbol}</div>
                                                    </div>
                                                </>}
                                            </div>
                                            <div className="w-[20%] flex flex-row justify-end opacity-85">{wallet}</div>
                                        </div>
                                    </div>)
                            })}
                        </div>
                    </>
                    }
                </Card>
            </div>
        </div>
    )
}