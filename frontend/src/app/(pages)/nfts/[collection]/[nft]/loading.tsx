import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="flex flex-col space-y-[1vw]">
            <div className="flex flex-row w-full space-x-[1vw]">
                <div className="flex flex-col w-[40%] space-y-[1vw]">
                    <Skeleton className="w-full h-[25vw]" />
                    <Skeleton className="w-full h-[15vw]" />
                </div>
                <div className="flex flex-col w-[60%] space-y-[1vw]">
                    <Skeleton className="w-full h-[10vw]" />
                    <Skeleton className="w-full h-[14vw]" />
                    <Skeleton className="w-full h-[15vw]" />
                </div>
            </div>
            <Skeleton className="w-full h-[15vw]" />
            <div className="flex flex-row justify-center">
                <Skeleton className="w-[10vw] h-[2vw]" />
            </div>
        </div>
    )
}
