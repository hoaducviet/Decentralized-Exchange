import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="flex flex-col items-center mt-[10vh] px-[30vw] w-full h-full space-y-[1vw]">
            <Skeleton className='w-full h-[3vw]' />
            <Skeleton className='w-full h-[10vw]' />
            <Skeleton className='w-full h-[10vw]' />
            <Skeleton className='w-full h-[3vw]' />
        </div>
    )
}
