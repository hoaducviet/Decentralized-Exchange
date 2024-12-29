
export default function NFTSLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="w-full">
            {children}
        </div>
    )
}