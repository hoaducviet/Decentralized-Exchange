'use client'
import useAuthCheck from "@/hooks/useAuthCheck"


export default function Admin() {
    useAuthCheck()

    return (
        <div className="select-none flex flex-col justify-center items-center w-full  py-[2vw] space-y-[2vw]">

        </div>
    )
}