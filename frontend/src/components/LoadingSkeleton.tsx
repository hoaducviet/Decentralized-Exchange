export default function LoadingSkeleton() {
    return (
        <div className="relative flex flex-col justify-center items-start w-full h-full">
            <div className="absolute inset-0 justify-center items-center">
                Loading...
            </div>
        </div>
    )
}

