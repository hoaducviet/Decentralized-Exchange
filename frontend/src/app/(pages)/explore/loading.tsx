import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="flex flex-col justify-start w-full h-full">
            <Skeleton className="w-full h-[40vw]" />
        </div>
    )
}
