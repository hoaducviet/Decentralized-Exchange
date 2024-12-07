import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="flex flex-col justify-center items-start w-full my-[2vw] space-y-[1vw]">
            <Skeleton className="w-full h-[2vw]" />
            <Skeleton className="w-full h-[10vw]" />
            <Skeleton className="w-full h-[10vw]" />
            <Skeleton className="w-full h-[3vw]" />
            <Skeleton className="w-full h-[15vw]" />
        </div>
    )
}
