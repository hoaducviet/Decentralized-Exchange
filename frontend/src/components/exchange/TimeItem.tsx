'use client'

import { Button } from "@/components/ui/button"


const listTime = [
    { name: '1 day' },
    { name: '1 week' },
    { name: '1 month' },
    { name: '1 year' },
]

export default function TimeItem() {

    return (
        <div className="flex flex-row justify-between items-center w-full my-4 px-[2%]">
            <div className="flex justify-center items-center">Expiry</div>
            <div className="flex flex-row justify-center items-center">
                {listTime.map((item, index) => {
                    return (
                        <Button variant="ghost" key={index} className="border rounded-2xl p-2 mx-[0.5%] h-[2vw]">{item.name}</Button>
                    )
                })}
            </div>
        </div>
    )
}