'use client'
import { useState, Dispatch, SetStateAction } from 'react';
import { Button } from "@/components/ui/button"

const listTime = [
    { name: '1 day', value: '1' },
    { name: '1 week', value: '7' },
    { name: '1 month', value: '30' },
    { name: '1 year', value: '365' },
]

interface Props {
    setTimeDate: Dispatch<SetStateAction<string>>;
}

export default function TimeItem({ setTimeDate }: Props) {
    const [isActive, setIsActive] = useState<number | null>(0)
    const handleActive = (index: number) => {
        setIsActive(index) 
        setTimeDate(listTime[index].value)
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
                            className={`rounded-2xl shadow-md p-2 mx-[0.5%] h-[2vw] mr-2 ${isActive === index && 'bg-purple-200 dark:bg-white/20'}`}
                        >{item.name}</Button>
                    )
                })}
            </div>
        </div>
    )
}