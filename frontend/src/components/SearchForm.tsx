'use client'

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export default function SearchForm() {
    const [searchValue, setSearchValue] = useState("")
    const [isOpened, setIsOpened] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
        setIsOpened(e.target.value.trim().length > 0)

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
                <PopoverContent className="w-[25vw]">
                    <div className="flex w-full h-full">
                        <div>{searchValue}</div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}