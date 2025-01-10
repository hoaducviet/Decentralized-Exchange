'use client'
import { useGetTokensQuery } from "@/redux/features/api/apiSlice"
import Link from "next/link"
import useAuthCheck from "@/hooks/useAuthCheck"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatPrice } from "@/utils/formatPrice"
import { CommitIcon, TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon, LinkIcon, ArrowPathIcon } from "@heroicons/react/24/outline"
import { useActiveTokenMutation, useAddTokenMutation, useCreateTokenMutation, useDeleteTokenMutation, useGetSuspendedTokensQuery, useUpdateTokensMutation } from "@/redux/features/admin/adminSlice"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/useToast"
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components//ui/tabs'
import { Input } from "@/components/ui/input"
import { Address } from "@/lib/type"
import { ethers } from "ethers"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"


const options = ['#', 'Token', 'Price', '1 day', 'FDV', 'Status']
const list = ['Total', 'Update Token', 'Add Token', 'Create Token']
export default function TokenAdmin() {
    useAuthCheck()
    const { data: tokens } = useGetTokensQuery()
    const { data: suspendedTokens } = useGetSuspendedTokensQuery()
    const { showSuccess, showError } = useToast()
    const [updateTokens, { isSuccess: isSuccessUpdateTokens, isError: isErrorUpdateTokens }] = useUpdateTokensMutation()
    const [deleteToken, { isSuccess: isSuccessDeleteToken, isError: isErrorDeleteToken }] = useDeleteTokenMutation()
    const [activeToken, { isSuccess: isSuccessActiveToken, isError: isErrorActiveToken }] = useActiveTokenMutation()
    const [createToken, { isSuccess: isSuccessCreateToken, isError: isErrorCreateToken }] = useCreateTokenMutation()
    const [addToken, { isSuccess: isSuccessAddToken, isError: isErrorAddToken }] = useAddTokenMutation()

    const [name, setName] = useState<string>("")
    const [img, setImg] = useState<string>("")
    const [symbol, setSymbol] = useState<string>("")
    const [owner, setOwner] = useState<string>("")
    const [supply, setSupply] = useState<string>("")
    const [decimals, setDecimals] = useState<number>(18)
    const [address, setAddress] = useState<string>("")

    useEffect(() => {
        if (isSuccessUpdateTokens) {
            showSuccess("Update Tokens Is Success!")
        }
        if (isErrorUpdateTokens) {
            showError("Update Tokens Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessUpdateTokens, isErrorUpdateTokens])

    useEffect(() => {
        if (isSuccessDeleteToken) {
            showSuccess("Deleted Tokens Is Success!")
        }
        if (isErrorDeleteToken) {
            showError("Deleted Tokens Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessDeleteToken, isErrorDeleteToken])

    useEffect(() => {
        if (isSuccessActiveToken) {
            showSuccess("Active Tokens Is Success!")
        }
        if (isErrorActiveToken) {
            showError("Active Tokens Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessActiveToken, isErrorActiveToken])

    useEffect(() => {
        if (isSuccessCreateToken) {
            showSuccess("Create Tokens Is Success!")
        }
        if (isErrorCreateToken) {
            showError("Create Tokens Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessCreateToken, isErrorCreateToken])

    useEffect(() => {
        if (isSuccessAddToken) {
            showSuccess("Add Tokens Is Success!")
        }
        if (isErrorAddToken) {
            showError("Add Tokens Failed!")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessAddToken, isErrorAddToken])

    const handleDeleteToken = async (_id: string) => {
        await deleteToken({ _id })
    }

    const handleActiveToken = async (_id: string) => {
        await activeToken({ _id })
    }

    const handleCreateToken = async () => {
        if (ethers.isAddress(owner)) {
            await createToken({
                name,
                img,
                symbol,
                decimals,
                owner: owner as Address,
                total_supply: supply
            })
        }
        setName("")
        setImg("")
        setSymbol("")
        setOwner("")
        setDecimals(18)
        setSupply("")
    }

    const handleAddToken = async () => {
        if (ethers.isAddress(owner)) {
            await addToken({ img, address: address as Address })
        }
        setImg("")
        setAddress("")
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }
    const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSymbol(e.target.value)
    }
    const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOwner(e.target.value)
    }
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value)
    }
    const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImg(e.target.value)
    }
    const handleDecimalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDecimals(parseInt(e.target.value))
    }
    const handleSupplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSupply(e.target.value)
    }

    return (
        <div className="select-none flex flex-col justify-center items-center w-full  py-[2vw] space-y-[2vw]">
            <div className="flex flex-row w-full justify-between items-center pr-[4vw] text-white">
                <div className="flex flex-col justify-center items-start bg-blue-500 dark:bg-white/10 dark:border-white/40 border-y-[0.1px] border-r-[0.1px] w-[10vw] h-[3.5vw] pl-[1vw] rounded-r-full">
                    <p className="text-xl font-semibold">{list[0]}</p>
                    <p >{`${tokens ? tokens?.length : 0} Token Active`}</p>
                </div>
                <div className="flex flex-row justify-end items-center space-x-[1vw]">
                    <div onClick={() => updateTokens()} className="cursor-pointer dark:bg-white/10 bg-blue-500 dark:border-white/40 hover:dark:border-blue-500 border-[0.1px] flex flex-row justify-end items-center rounded-2xl shadow-2xl space-x-2 h-[3vw] px-[1vw]">
                        <ArrowPathIcon className="w-[1.5vw] h-[1.5vw]" />
                        <p className="font-semibold ">{list[1]}</p>
                    </div>
                    <AlertDialog >
                        <AlertDialogTrigger asChild>
                            <div className="cursor-pointer dark:bg-white/10 bg-blue-500 dark:border-white/40 hover:dark:border-blue-500 border-[0.1px] flex flex-row justify-end items-center rounded-2xl shadow-2xl space-x-2 h-[3vw] px-[1vw]">
                                <LinkIcon className="w-[1.5vw] h-[1.5vw]" />
                                <p className="font-semibold ">{list[2]}</p>
                            </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                            <AlertDialogHeader className="bg-fixed w-full">
                                <AlertDialogTitle>Add Token</AlertDialogTitle>
                                <VisuallyHidden>
                                    <AlertDialogDescription>Form Token Admin</AlertDialogDescription>
                                </VisuallyHidden>
                            </AlertDialogHeader>
                            <div className="flex flex-col w-full space-y-[1vw]">
                                <div className="flex flex-row justify-center items-center w-full space-x-[1vw]">
                                    <Avatar className="w-[2vw] h-[2vw]">
                                        <AvatarImage src={img} />
                                        <AvatarFallback>T</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="flex flex-col justify-center items-start w-full space-y-[0.5vw]">
                                    <p>Address token</p>
                                    <Input type="text" value={address} placeholder="0x123456..." onChange={handleAddressChange} />
                                </div>
                                <div className="flex flex-col justify-center items-start w-full space-y-[0.5vw]">
                                    <p>Image link</p>
                                    <Input type="text" value={img} placeholder="link" onChange={handleImgChange} />
                                </div>
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel >Close</AlertDialogCancel>
                                <AlertDialogAction onClick={handleAddToken} >Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog >
                        <AlertDialogTrigger asChild>
                            <div className="cursor-pointer dark:bg-white/10 bg-blue-500 dark:border-white/40 hover:dark:border-blue-500 border-[0.1px] flex flex-row justify-end items-center rounded-2xl shadow-md space-x-2 h-[3vw] px-[1vw]">
                                <PlusCircleIcon className="w-[1.5vw] h-[1.5vw]" />
                                <p className="font-semibold">{list[3]}</p>
                            </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="select-none w-[25vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                            <AlertDialogHeader className="bg-fixed w-full">
                                <AlertDialogTitle>Create Token</AlertDialogTitle>
                                <VisuallyHidden>
                                    <AlertDialogDescription>Form Pool Admin</AlertDialogDescription>
                                </VisuallyHidden>
                            </AlertDialogHeader>
                            <div className="flex flex-col w-full space-y-[1vw]">
                                <div className="flex flex-row justify-center items-center w-full space-x-[1vw]">
                                    <Avatar className="w-[2vw] h-[2vw]">
                                        <AvatarImage src={img} />
                                        <AvatarFallback>T</AvatarFallback>
                                    </Avatar>
                                    <p className="font-semibold">{name}</p>
                                    <p className="font-semibold opacity-60">{symbol}</p>
                                </div>
                                <div className="flex flex-col justify-center items-start w-full space-y-[0.5vw]">
                                    <p>Name</p>
                                    <Input type="text" value={name} placeholder="name" onChange={handleNameChange} />
                                </div>
                                <div className="flex flex-col justify-center items-start w-full space-y-[0.5vw]">
                                    <p>Symbol</p>
                                    <Input type="text" value={symbol} placeholder="symbol" onChange={handleSymbolChange} />
                                </div>
                                <div className="flex flex-col justify-center items-start w-full space-y-[0.5vw]">
                                    <p>Image link</p>
                                    <Input type="text" value={img} placeholder="link" onChange={handleImgChange} />
                                </div>
                                <div className="flex flex-col justify-center items-start w-full space-y-[0.5vw]">
                                    <p>Address owner</p>
                                    <Input type="text" value={owner} placeholder="0x123456..." onChange={handleOwnerChange} />
                                </div>
                                <div className="flex flex-col justify-center items-start w-full space-y-[0.5vw]">
                                    <p>Total supply</p>
                                    <Input type="text" value={supply} placeholder="number" onChange={handleSupplyChange} />
                                </div>
                                <div className="flex flex-col justify-center items-start w-full space-y-[0.5vw]">
                                    <p>Decimal</p>
                                    <Input type="number" value={decimals} min="0" step='1' placeholder="number" onChange={handleDecimalChange} />
                                </div>
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel >Close</AlertDialogCancel>
                                <AlertDialogAction onClick={handleCreateToken} >Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            <div className="w-full px-[4vw]">
                <Tabs defaultValue="active" className="flex flex-col justify-center">
                    <TabsList className="flex flex-rol select-none justify-center items-center mx-[40%]">
                        <TabsTrigger value="active" className="w-[50%] h-full">Active</TabsTrigger>
                        <TabsTrigger value="suspended" className="w-[50%] h-full">Suspended</TabsTrigger>
                    </TabsList>
                    <TabsContent value="active" className="w-full">
                        <Card className=" flex flex-col w-full rounded-2xl border-[1px] shadow-md ">
                            <div className="bg-secondary/80 hover:bg-secondary flex flex-row justify-between items-center text-md font-semibold rounded-t-2xl h-[3vw] px-4">
                                <div className="w-[5%] flex flex-row justify-start items-center">{options[0]}</div>
                                <div className="w-[20%] flex flex-row justify-start items-center">{options[1]}</div>
                                <div className="w-[15%] flex flex-row justify-end items-center">{options[2]}</div>
                                <div className="w-[15%] flex flex-row justify-end items-center">{options[3]}</div>
                                <div className="w-[15%] flex flex-row justify-end items-center">{options[4]}</div>
                                <div className="w-[15%] flex flex-row justify-end items-center">{options[5]}</div>
                                <div className="w-[15%] flex flex-row justify-end items-center"></div>
                            </div>
                            <div className="flex flex-col max-h-[55vw] overflow-x-auto ">
                                {tokens && tokens.map((token, index) => {
                                    if (token.symbol === 'USD') return <div key={index}></div>
                                    const percentChange = parseFloat(token.price_reference) > 0 ? (parseFloat(token.price) - parseFloat(token.price_reference)) / parseFloat(token.price_reference) : 0
                                    return (
                                        <div key={index}>
                                            <div className={`flex flex-row cursor-pointer hover:bg-secondary/80 dark:hover:bg-white/5 text-md font-medium items-center h-[3.5vw] w-full px-4 border-t-[0.2px] border-gray-300 border-opacity-20 ${index === tokens.length - 1 ? 'rounded-b-2xl' : ''}`} >
                                                <p className="w-[5%] flex flex-row justify-start items-center">{index + 1}</p>
                                                <div className="w-[20%] flex flex-row justify-start items-center hover:underline">
                                                    <Link href={`/explore/tokens/${token.symbol}`} className="flex flex-row justify-start items-center space-x-[0.3vw] font-semibold">
                                                        <Avatar className="w-[1.5vw] h-[1.5vw]">
                                                            <AvatarImage src={token.img} />
                                                            <AvatarFallback>T</AvatarFallback>
                                                        </Avatar>
                                                        <p>{token.name}</p>
                                                        <p className="opacity-60">{token.symbol}</p>
                                                    </Link>
                                                </div>
                                                <p className="w-[15%] flex flex-row justify-end items-center">${(parseFloat(token.price)).toFixed(2)}</p>
                                                <div className="w-[15%] flex flex-row justify-end items-center">{percentChange >= 0 ?
                                                    <div className="text-green-600 flex flex-row justify-end items-center space-x-[0.1vw]">
                                                        <TriangleUpIcon className="w-[1.5vw] h-[1.5vw]" />
                                                        <p>
                                                            {percentChange.toFixed(2)}%
                                                        </p>
                                                    </div> : <div className="text-red-500 flex flex-row justify-end items-center space-x-[0.1vw]">
                                                        <TriangleDownIcon className="w-[1.5vw] h-[1.5vw]" />
                                                        <p>
                                                            {(0 - percentChange).toFixed(2)}%
                                                        </p>
                                                    </div>
                                                }</div>
                                                <p className="w-[15%] flex flex-row justify-end items-center">${formatPrice((parseFloat(token.total_supply) * parseFloat(token.price)))}</p>
                                                <div className="w-[15%] flex flex-row justify-end items-center space-x-2">
                                                    <CommitIcon className="w-[1vw] h-[1vw] stroke-green-600" />
                                                    <p>active</p>
                                                </div>
                                                <div className="w-[15%] flex flex-row justify-end items-center">
                                                    <AlertDialog >
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline">Suspended</Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                                            <AlertDialogHeader className="bg-fixed w-full">
                                                                <AlertDialogTitle>Suspended Token</AlertDialogTitle>
                                                                <VisuallyHidden>
                                                                    <AlertDialogDescription>Form Pool Admin</AlertDialogDescription>
                                                                </VisuallyHidden>
                                                            </AlertDialogHeader>
                                                            <div className="flex flex-col w-full space-y-[1vw]">
                                                                <div className="flex flex-row justify-center items-center w-full space-x-[1vw]">
                                                                    <Avatar className="w-[2vw] h-[2vw]">
                                                                        <AvatarImage src={token.img} />
                                                                        <AvatarFallback>T</AvatarFallback>
                                                                    </Avatar>
                                                                    <p className="font-semibold">{token.name}</p>
                                                                </div>
                                                                <div className="flex flex-row justify-between items-center space-x-[1vw] w-full">
                                                                    <p className="font-semibold">Address</p>
                                                                    <p>{`${token.address.slice(0, 10)}...${token.address.slice(35)}`}</p>
                                                                </div>
                                                                <div className="flex flex-row justify-between items-center w-full">
                                                                    <p className="font-semibold">Price</p>
                                                                    <div className="flex flex-row justify-end items-center space-x-[0.5vw]">
                                                                        <div className="w-[15%] flex flex-row justify-end items-center">{percentChange >= 0 ?
                                                                            <div className="text-green-600 flex flex-row justify-end items-center space-x-[0.1vw]">
                                                                                <TriangleUpIcon className="w-[1.5vw] h-[1.5vw]" />
                                                                                <p>
                                                                                    {percentChange.toFixed(2)}%
                                                                                </p>
                                                                            </div> : <div className="text-red-500 flex flex-row justify-end items-center space-x-[0.1vw]">
                                                                                <TriangleDownIcon className="w-[1.5vw] h-[1.5vw]" />
                                                                                <p>
                                                                                    {(0 - percentChange).toFixed(2)}%
                                                                                </p>
                                                                            </div>
                                                                        }</div>
                                                                        <p>${parseFloat(token.price).toFixed(2)}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel >Close</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteToken(token._id)} >Continue</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Card>
                    </TabsContent>
                    <TabsContent value="suspended" className="w-full">
                        <Card className=" flex flex-col w-full rounded-2xl border-[1px] shadow-md ">
                            <div className="bg-secondary/80 hover:bg-secondary flex flex-row justify-between items-center text-md font-semibold rounded-t-2xl h-[3vw] px-4">
                                <div className="w-[5%] flex flex-row justify-start items-center">{options[0]}</div>
                                <div className="w-[20%] flex flex-row justify-start items-center">{options[1]}</div>
                                <div className="w-[20%] flex flex-row justify-end items-center">{options[2]}</div>
                                <div className="w-[20%] flex flex-row justify-end items-center">{options[4]}</div>
                                <div className="w-[20%] flex flex-row justify-end items-center">{options[5]}</div>
                                <div className="w-[15%] flex flex-row justify-end items-center"></div>
                            </div>
                            <div className="flex flex-col max-h-[55vw] overflow-x-auto ">
                                {suspendedTokens && suspendedTokens.map((token, index) => {
                                    if (token.symbol === 'USD') return <div key={index}></div>
                                    return (
                                        <div key={index}>
                                            <div className={`flex flex-row cursor-pointer hover:bg-secondary/80 dark:hover:bg-white/5 text-md font-medium items-center h-[3.5vw] w-full px-4 border-t-[0.2px] border-gray-300 border-opacity-20 ${index === suspendedTokens.length - 1 ? 'rounded-b-2xl' : ''}`} >
                                                <p className="w-[5%] flex flex-row justify-start items-center">{index + 1}</p>
                                                <div className="w-[20%] flex flex-row justify-start items-center hover:underline">
                                                    <Link href={`/explore/tokens/${token.symbol}`} className="flex flex-row justify-start items-center space-x-[0.3vw] font-semibold">
                                                        <Avatar className="w-[1.5vw] h-[1.5vw]">
                                                            <AvatarImage src={token.img} />
                                                            <AvatarFallback>T</AvatarFallback>
                                                        </Avatar>
                                                        <p>{token.name}</p>
                                                        <p className="opacity-60">{token.symbol}</p>
                                                    </Link>
                                                </div>
                                                <p className="w-[20%] flex flex-row justify-end items-center">${(parseFloat(token.price)).toFixed(2)}</p>
                                                <p className="w-[20%] flex flex-row justify-end items-center">${formatPrice((parseFloat(token.total_supply) * parseFloat(token.price)))}</p>
                                                <div className="w-[20%] flex flex-row justify-end items-center space-x-2">
                                                    <CommitIcon className="w-[1vw] h-[1vw] stroke-red-600" />
                                                    <p>suspended</p>
                                                </div>
                                                <div className="w-[15%] flex flex-row justify-end items-center">
                                                    <AlertDialog >
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline">Active</Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                                                            <AlertDialogHeader className="bg-fixed w-full">
                                                                <AlertDialogTitle>Active Token</AlertDialogTitle>
                                                                <VisuallyHidden>
                                                                    <AlertDialogDescription>Form Pool Admin</AlertDialogDescription>
                                                                </VisuallyHidden>
                                                            </AlertDialogHeader>
                                                            <div className="flex flex-col w-full space-y-[1vw]">
                                                                <div className="flex flex-row justify-center items-center w-full space-x-[1vw]">
                                                                    <Avatar className="w-[2vw] h-[2vw]">
                                                                        <AvatarImage src={token.img} />
                                                                        <AvatarFallback>T</AvatarFallback>
                                                                    </Avatar>
                                                                    <p className="font-semibold">{token.name}</p>
                                                                </div>
                                                                <div className="flex flex-row justify-between items-center space-x-[1vw] w-full">
                                                                    <p className="font-semibold">Address</p>
                                                                    <p>{`${token.address.slice(0, 10)}...${token.address.slice(35)}`}</p>
                                                                </div>
                                                                <div className="flex flex-row justify-between items-center w-full">
                                                                    <p className="font-semibold">Price</p>
                                                                    <p>${parseFloat(token.price).toFixed(2)}</p>
                                                                </div>
                                                            </div>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel >Close</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleActiveToken(token._id)} >Continue</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
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