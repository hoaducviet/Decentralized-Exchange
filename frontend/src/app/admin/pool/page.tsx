'use client'
import Link from "next/link"
import useAuthCheck from "@/hooks/useAuthCheck"
import { useGetPoolsQuery } from "@/redux/features/api/apiSlice"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatPrice } from "@/utils/formatPrice"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon, LinkIcon, ArrowTrendingUpIcon, ArrowPathIcon } from "@heroicons/react/24/outline"
import { useActivePoolMutation, useDeletePoolMutation, useGetSuspendedPoolsQuery, useUpdatePoolsMutation, useUpdateReservesMutation } from "@/redux/features/admin/adminSlice"
import { useToast } from "@/hooks/useToast"
import { useEffect } from "react"
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components//ui/tabs'
import { CommitIcon } from "@radix-ui/react-icons"


const options = ['#', 'Pool', 'TVL', 'APR', '1D/TVL', 'Status']
const list = ['Total', 'Update Reserve', 'Update Pools', 'Add Pool', 'Create Pool']
export default function PoolAdmin() {
    useAuthCheck()
    const { showSuccess, showError } = useToast()
    const { data: pools } = useGetPoolsQuery()
    const { data: suspendedPools } = useGetSuspendedPoolsQuery()
    const [updatePools, { isSuccess: isSuccessUpdatePools, isError: isErrorUpdatePools }] = useUpdatePoolsMutation()
    const [updateReserves, { isSuccess: isSuccessUpdateReserves, isError: isErrorUpdateReserves }] = useUpdateReservesMutation()
    const [deletePool, { isSuccess: isSuccessDeletePool, isError: isErrorDeletePool }] = useDeletePoolMutation()
    const [activePool, { isSuccess: isSuccessActivePool, isError: isErrorActivePool }] = useActivePoolMutation()

    useEffect(() => {
        if (isSuccessUpdatePools) {
            showSuccess("Update Pools Is Success!")
        }
        if (isErrorUpdatePools) {
            showError("Update Pools Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessUpdatePools, isErrorUpdatePools])

    useEffect(() => {
        if (isSuccessDeletePool) {
            showSuccess("Deleted Pools Is Success!")
        }
        if (isErrorDeletePool) {
            showError("Deleted Pools Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessDeletePool, isErrorDeletePool])

    useEffect(() => {
        if (isSuccessActivePool) {
            showSuccess("Active Pools Is Success!")
        }
        if (isErrorActivePool) {
            showError("Active Pools Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessActivePool, isErrorActivePool])

    useEffect(() => {
        if (isSuccessUpdateReserves) {
            showSuccess("Update Reserves Is Success!")
        }
        if (isErrorUpdateReserves) {
            showError("Update Reserves Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessUpdateReserves, isErrorUpdateReserves])

    const handleDeletePool = async (_id: string) => {
        await deletePool({ _id })
    }

    const handleActivePool = async (_id: string) => {
        await activePool({ _id })
    }

    return (
        <div className="select-none flex flex-col justify-center items-center w-full  py-[2vw] space-y-[2vw]">
            <div className="flex flex-row w-full justify-between items-center pr-[4vw] text-white">
                <div className="flex flex-col justify-center items-start bg-blue-500 dark:bg-white/10 dark:border-white/40 border-y-[0.1px] border-r-[0.1px] w-[8vw] h-[3.5vw] pl-[1vw] rounded-r-full">
                    <p className="text-xl font-semibold">{list[0]}</p>
                    <p >{`${pools?.length} Pools`}</p>
                </div>
                <div className="flex flex-row justify-end items-center space-x-[1vw]">
                    <div onClick={() => updateReserves()} className="cursor-pointer dark:bg-white/10 bg-blue-500 dark:border-white/40 hover:dark:border-blue-500 border-[0.1px] flex flex-row justify-end items-center rounded-2xl shadow-2xl space-x-2 h-[3vw] px-[1vw]">
                        <ArrowTrendingUpIcon className="w-[1.5vw] h-[1.5vw]" />
                        <p className="font-semibold ">{list[1]}</p>
                    </div>
                    <div onClick={() => updatePools()} className="cursor-pointer dark:bg-white/10 bg-blue-500 dark:border-white/40 hover:dark:border-blue-500 border-[0.1px] flex flex-row justify-end items-center rounded-2xl shadow-2xl space-x-2 h-[3vw] px-[1vw]">
                        <ArrowPathIcon className="w-[1.5vw] h-[1.5vw]" />
                        <p className="font-semibold ">{list[2]}</p>
                    </div>
                    <div className="cursor-pointer dark:bg-white/10 bg-blue-500 dark:border-white/40 hover:dark:border-blue-500 border-[0.1px] flex flex-row justify-end items-center rounded-2xl shadow-2xl space-x-2 h-[3vw] px-[1vw]">
                        <LinkIcon className="w-[1.5vw] h-[1.5vw]" />
                        <p className="font-semibold ">{list[3]}</p>
                    </div>
                    <div className="cursor-pointer dark:bg-white/10 bg-blue-500 dark:border-white/40 hover:dark:border-blue-500 border-[0.1px] flex flex-row justify-end items-center rounded-2xl shadow-md space-x-2 h-[3vw] px-[1vw]">
                        <PlusCircleIcon className="w-[1.5vw] h-[1.5vw]" />
                        <p className="font-semibold">{list[4]}</p>
                    </div>
                </div>
            </div>
            <div className="w-full px-[4vw]">
                <Tabs defaultValue="active" className="flex flex-col justify-center">
                    <TabsList className="flex flex-rol select-none justify-center items-center mx-[40%]">
                        <TabsTrigger value="active" className="w-[50%] h-full">Active</TabsTrigger>
                        <TabsTrigger value="suspended" className="w-[50%] h-full">Suspended</TabsTrigger>
                    </TabsList>
                    <TabsContent value="active" className="w-full">
                        <Card className="flex flex-col w-full rounded-2xl border-[1px] shadow-md h-[79vh] overflow-y-auto">
                            <div className="w-full">
                                <div className="bg-secondary/80 hover:bg-secondary flex flex-row justify-between items-center text-md font-semibold rounded-t-2xl h-[3vw] px-4">
                                    <p className="w-[5%] flex flex-row justify-start items-center">{options[0]}</p>
                                    <p className="w-[20%] flex flex-row justify-start items-center">{options[1]}</p>
                                    <p className="w-[15%] flex flex-row justify-start items-center">{options[2]}</p>
                                    <p className="w-[15%] flex flex-row justify-start items-center">{options[3]}</p>
                                    <p className="w-[15%] flex flex-row justify-start items-center">{options[4]}</p>
                                    <p className="w-[15%] flex flex-row justify-start items-center">{options[5]}</p>
                                    <p className="w-[15%] flex flex-row justify-end items-center"></p>
                                </div>
                            </div>
                            <div className="flex flex-col overflow-x-hidden">
                                {pools && pools.map((pool, index) => {
                                    const ARP = parseFloat(pool.total_tvl) > 0 ? parseFloat(pool.volume_day) * 0.1 / parseFloat(pool.total_tvl) * 365 : 0
                                    return (
                                        <div key={index} className={`flex flex-row cursor-pointer hover:bg-secondary/80 dark:hover:bg-white/5 text-md font-medium items-center h-[3.5vw] w-full px-4 border-t-[0.2px] border-gray-300 border-opacity-20 ${index === pools.length - 1 ? 'rounded-b-2xl' : ''}`} >
                                            <p className="font-medium w-[5%]">{index + 1}</p>
                                            <div className=" w-[20%] flex flex-row justify-start items-center space-x-[0.3vw] h-[3.5vw] font-semibold">
                                                <Link href={`/explore/pools/${pool.address}`} className="flex flex-row justify-start items-center space-x-[0.3vw] font-semibold hover:underline">
                                                    <Avatar className="w-[1.5vw] h-[1.5vw] max-w-[5vw] border border-black">
                                                        <div className="realtive flex">
                                                            <AvatarImage src={pool.token1.img}
                                                                className="absolute w-full h-full object-cover"
                                                                style={{ clipPath: "inset(0 50% 0 0)" }}
                                                                alt="Token1" />
                                                            <AvatarImage src={pool.token2.img}
                                                                className="absolute w-full h-full object-cover"
                                                                style={{ clipPath: "inset(0 0 0 50%)" }}
                                                                alt="Token2" />
                                                        </div>
                                                        <AvatarFallback>T</AvatarFallback>
                                                    </Avatar>
                                                    <div>{pool.name}</div>
                                                </Link>
                                            </div>
                                            <p className="flex flex-row justify-start w-[15%]">{`$${formatPrice(parseFloat(pool.total_tvl))}`}</p>
                                            <p className="flex flex-row justify-start w-[15%]">{`${ARP.toFixed(2)}%`}</p>
                                            <p className="flex flex-row justify-start w-[15%]">{`$${formatPrice(parseFloat(pool.tvl_day))}`}</p>
                                            <div className="flex flex-row justify-start items-center space-x-2 w-[15%]">
                                                <CommitIcon className="w-[1vw] h-[1vw] stroke-green-600" />
                                                <p>active</p>
                                            </div>
                                            <div className="flex flex-row justify-center w-[15%]">
                                                <AlertDialog >
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline">Suspended</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                                        <AlertDialogHeader className="bg-fixed w-full">
                                                            <AlertDialogTitle>Suspended Token</AlertDialogTitle>
                                                        </AlertDialogHeader>
                                                        <div className="flex flex-col w-full space-y-[1vw]">
                                                            <div className="flex flex-row justify-center items-center w-full space-x-[1vw]">
                                                                <Avatar className="w-[1.5vw] h-[1.5vw] max-w-[5vw] border border-black">
                                                                    <div className="realtive flex">
                                                                        <AvatarImage src={pool.token1.img}
                                                                            className="absolute w-full h-full object-cover"
                                                                            style={{ clipPath: "inset(0 50% 0 0)" }}
                                                                            alt="Token1" />
                                                                        <AvatarImage src={pool.token2.img}
                                                                            className="absolute w-full h-full object-cover"
                                                                            style={{ clipPath: "inset(0 0 0 50%)" }}
                                                                            alt="Token2" />
                                                                    </div>
                                                                    <AvatarFallback>T</AvatarFallback>
                                                                </Avatar>
                                                                <div>{pool.name}</div>
                                                            </div>
                                                            <div className="flex flex-row justify-between items-center space-x-[1vw] w-full">
                                                                <p className="font-semibold">Address</p>
                                                                <p>{`${pool.address.slice(0, 10)}...${pool.address.slice(35)}`}</p>
                                                            </div>
                                                            <div className="flex flex-row justify-between items-center w-full">
                                                                <p className="font-semibold">APR</p>
                                                                <p>{`${ARP.toFixed(2)}%`}</p>
                                                            </div>
                                                            <div className="flex flex-row justify-between items-center w-full">
                                                                <p className="font-semibold">TVL</p>
                                                                <p>{`$${formatPrice(parseFloat(pool.total_tvl))}`}</p>
                                                            </div>
                                                        </div>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel >Close</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeletePool(pool._id)} >Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Card>
                    </TabsContent>
                    <TabsContent value="suspended" className="w-full">
                        <Card className="flex flex-col w-full rounded-2xl border-[1px] shadow-md h-[79vh] overflow-y-auto">
                            <div className="w-full">
                                <div className="bg-secondary/80 hover:bg-secondary flex flex-row justify-between items-center text-md font-semibold rounded-t-2xl h-[3vw] px-4">
                                    <p className="w-[5%] flex flex-row justify-start items-center">{options[0]}</p>
                                    <p className="w-[20%] flex flex-row justify-start items-center">{options[1]}</p>
                                    <p className="w-[15%] flex flex-row justify-start items-center">{options[2]}</p>
                                    <p className="w-[15%] flex flex-row justify-start items-center">{options[3]}</p>
                                    <p className="w-[15%] flex flex-row justify-start items-center">{options[4]}</p>
                                    <p className="w-[15%] flex flex-row justify-start items-center">{options[5]}</p>
                                    <p className="w-[15%] flex flex-row justify-end items-center"></p>
                                </div>
                            </div>
                            <div className="flex flex-col overflow-x-hidden">
                                {suspendedPools && suspendedPools.map((pool, index) => {
                                    const ARP = parseFloat(pool.total_tvl) > 0 ? parseFloat(pool.volume_day) * 0.1 / parseFloat(pool.total_tvl) * 365 : 0
                                    return (
                                        <div key={index} className={`flex flex-row cursor-pointer hover:bg-secondary/80 dark:hover:bg-white/5 text-md font-medium items-center h-[3.5vw] w-full px-4 border-t-[0.2px] border-gray-300 border-opacity-20 ${index === suspendedPools.length - 1 ? 'rounded-b-2xl' : ''}`} >
                                            <p className="font-medium w-[5%]">{index + 1}</p>
                                            <div className=" w-[20%] flex flex-row justify-start items-center space-x-[0.3vw] h-[3.5vw] font-semibold">
                                                <Link href={`/explore/pools/${pool.address}`} className="flex flex-row justify-start items-center space-x-[0.3vw] font-semibold hover:underline">
                                                    <Avatar className="w-[1.5vw] h-[1.5vw] max-w-[5vw] border border-black">
                                                        <div className="realtive flex">
                                                            <AvatarImage src={pool.token1.img}
                                                                className="absolute w-full h-full object-cover"
                                                                style={{ clipPath: "inset(0 50% 0 0)" }}
                                                                alt="Token1" />
                                                            <AvatarImage src={pool.token2.img}
                                                                className="absolute w-full h-full object-cover"
                                                                style={{ clipPath: "inset(0 0 0 50%)" }}
                                                                alt="Token2" />
                                                        </div>
                                                        <AvatarFallback>T</AvatarFallback>
                                                    </Avatar>
                                                    <div>{pool.name}</div>
                                                </Link>
                                            </div>
                                            <p className="flex flex-row justify-start w-[15%]">{`$${formatPrice(parseFloat(pool.total_tvl))}`}</p>
                                            <p className="flex flex-row justify-start w-[15%]">{`${ARP.toFixed(2)}%`}</p>
                                            <p className="flex flex-row justify-start w-[15%]">{`$${formatPrice(parseFloat(pool.tvl_day))}`}</p>
                                            <div className="flex flex-row justify-start items-center space-x-2 w-[15%]">
                                                <CommitIcon className="w-[1vw] h-[1vw] stroke-red-600" />
                                                <p>suspended</p>
                                            </div>
                                            <div className="flex flex-row justify-end w-[10%]">
                                                <AlertDialog >
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline">Active</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                                        <AlertDialogHeader className="bg-fixed w-full">
                                                            <AlertDialogTitle>Active Token</AlertDialogTitle>
                                                        </AlertDialogHeader>
                                                        <div className="flex flex-col w-full space-y-[1vw]">
                                                            <div className="flex flex-row justify-center items-center w-full space-x-[1vw]">
                                                                <Avatar className="w-[1.5vw] h-[1.5vw] max-w-[5vw] border border-black">
                                                                    <div className="realtive flex">
                                                                        <AvatarImage src={pool.token1.img}
                                                                            className="absolute w-full h-full object-cover"
                                                                            style={{ clipPath: "inset(0 50% 0 0)" }}
                                                                            alt="Token1" />
                                                                        <AvatarImage src={pool.token2.img}
                                                                            className="absolute w-full h-full object-cover"
                                                                            style={{ clipPath: "inset(0 0 0 50%)" }}
                                                                            alt="Token2" />
                                                                    </div>
                                                                    <AvatarFallback>T</AvatarFallback>
                                                                </Avatar>
                                                                <div>{pool.name}</div>
                                                            </div>
                                                            <div className="flex flex-row justify-between items-center space-x-[1vw] w-full">
                                                                <p className="font-semibold">Address</p>
                                                                <p>{`${pool.address.slice(0, 10)}...${pool.address.slice(35)}`}</p>
                                                            </div>
                                                            <div className="flex flex-row justify-between items-center w-full">
                                                                <p className="font-semibold">APR</p>
                                                                <p>{`${ARP.toFixed(2)}%`}</p>
                                                            </div>
                                                            <div className="flex flex-row justify-between items-center w-full">
                                                                <p className="font-semibold">TVL</p>
                                                                <p>{`$${formatPrice(parseFloat(pool.total_tvl))}`}</p>
                                                            </div>
                                                        </div>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel >Close</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleActivePool(pool._id)} >Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}