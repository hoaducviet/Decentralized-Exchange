'use client'

export default function NFTLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-[100vh] mx-[15vw] my-[3vw]">
            {children}
        </div>
    )
}