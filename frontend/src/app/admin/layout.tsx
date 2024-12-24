'use client'

import { usePathname, useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useEffect, useState } from "react";


export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter()
    const path = usePathname()
    const [token, setToken] = useState<string | null>(null)
    const role = useRole(token ?? "")

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const newToken = localStorage.getItem('token')
            setToken(newToken)
        }
    }, [])

    useEffect(() => {
        if (path.includes('admin')) {
            if (role !== 'admin') {
                router.push('/')
            }else {
                router.push('/admin')
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role])

    return (
        <div className="w-full h-full">{role === 'admin' && children}</div>
    )
}