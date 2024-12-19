import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="flex flex-col justify-center items-start mx-[15vw] my-[2vw] space-y-[2vw]">
            <Skeleton className="w-full h-[30vw]" />
            <Skeleton className="w-full h-[35vw]" />
        </div>
    )
}
