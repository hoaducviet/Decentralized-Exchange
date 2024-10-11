'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"

const listTime = [
    { name: '1 day' },
    { name: '1 week' },
    { name: '1 month' },
    { name: '1 year' },
]

export default function TimeItem() {

    const [isActive, setIsActive] = useState<number | null>(0)
    const handleActive = (index: number) => {
        setIsActive(index)
    }
    return (
        <div className="flex flex-row justify-between items-center select-none w-full my-4 px-[2%]">
            <div className="flex justify-center items-center">Expiry</div>
            <div className="flex flex-row justify-center items-center">
                {listTime.map((item, index) => {
                    return (
                        <Button
                            key={index}
                            variant="ghost"
                            onClick={() => handleActive(index)}
                            className={`rounded-2xl shadow-md p-2 mx-[0.5%] h-[2vw] mr-2 ${isActive === index && 'bg-purple-200 hover:bg-purple-200'}`}
                        >{item.name}</Button>
                    )
                })}
            </div>
        </div>
    )
}