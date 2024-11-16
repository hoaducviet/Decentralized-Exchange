'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from "react"
import { useGetSearchQuery } from "@/redux/features/api/apiSlice"
import useDebounce from '@/hooks/useDebounce'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export default function SearchForm() {
    const router = useRouter()
    const [searchValue, setSearchValue] = useState("")
    const [isOpened, setIsOpened] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const debounced = useDebounce({ value: searchValue, delay: 500 })
    const { data, isFetching } = useGetSearchQuery(debounced)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue((e.target.value))
        setIsOpened(e.target.value.trim().length > 0)
    }
    const handleClick = (link: string) => {
        setIsOpened(false)
        setSearchValue("")
        router.push(link)
    }

    useEffect(() => {
        if (isOpened && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 0)
        }
    }, [isOpened])

    return (
        <div className="flex flex-col w-full h-full">
            <Popover
                open={isOpened}
                onOpenChange={(open) => {
                    setIsOpened(open)
                }}
            >
                <PopoverTrigger asChild>
                    <div className="flex w-[25vw] h-full">
                        <Input
                            type="text"
                            placeholder="Search token and nft"
                            value={searchValue}
                            onChange={handleChange}
                            ref={inputRef}
                        />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-[25vw] px-0 py-0">
                    {!isFetching && data &&
                        <div className="flex flex-col w-full h-full space-y-2">
                            {data.tokens.length > 0 ?
                                <div className="flex flex-col border-b-[0.2px] my-2 py-1">
                                    <div className="text-sm font-semibold opacity-75 pb-1 px-3">Token</div>
                                    {data.tokens.map((item, index) => {
                                        return (
                                            <div key={index} onClick={() => handleClick(`/explore/tokens/${item.symbol}`)} className="cursor-pointer hover:bg-secondary/80 flex flex-row items-center space-x-[0.5vw] h-[2.5vw] px-3">
                                                <Avatar className="w-[2vw] h-[2vw] border border-blue-200">
                                                    <AvatarImage src={item.img} alt="Token" />
                                                    <AvatarFallback>T</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-row w-full justify-between space-x[0.3vw] text-md font-semibold">
                                                    <div className=" flex flex-row items-center justify-start space-x-[0.4vw]">
                                                        <div>{item.name}</div>
                                                        <div className="text-sm opacity-60">{item.symbol}</div>
                                                    </div>
                                                    <div className="text-sm">
                                                        $100
                                                    </div>
                                                </div>

                                            </div>
                                        )
                                    })}
                                </div> : <></>
                            }
                            {data.nfts.length > 0 ?
                                <div className="flex flex-col my-2 py-1">
                                    <div className="text-sm font-semibold opacity-75 pb-1 px-3">NFTs</div>
                                    {data?.nfts.map((item, index) => {
                                        return (
                                            <div key={index} onClick={() => handleClick(`/nfts/${item.symbol}`)} className="cursor-pointer hover:bg-secondary/80 flex flex-row items-center space-x-[0.5vw] h-[2.5vw] px-3">
                                                <Avatar className="w-[2vw] h-[2vw] border border-blue-200">
                                                    <AvatarImage src={'/image/default-nft.png'} alt="Token" />
                                                    <AvatarFallback>T</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-row w-full justify-between space-x[0.3vw] text-md font-semibold">
                                                    <div className=" flex flex-row items-center justify-start space-x-[0.4vw]">
                                                        <div>{item.name}</div>
                                                        <div className="text-sm opacity-60">{item.symbol}</div>
                                                    </div>
                                                    <div className="text-sm">
                                                        $100
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div> : <></>
                            }
                        </div>
                    }
                </PopoverContent>
            </Popover>
        </div>
    )
}