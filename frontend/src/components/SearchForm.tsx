'use client'

import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useRef, useState } from "react"

export default function SearchForm() {
    const [searchValue, setSearchValue] = useState("")
    const [isOpened, setIsOpened] = useState(false)

    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    useEffect(() => {
        if (!searchValue.trim()) {
            setIsOpened(false)
            return;
        }

        const fetchApi = async () => {
            setIsOpened(true);
        };

        fetchApi();
    }, [searchValue])

    useEffect(() => {
        if (!!inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpened])

    return (
        <div className="flex flex-col w-full h-full">
            <Popover open={isOpened}>
                <PopoverTrigger>
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