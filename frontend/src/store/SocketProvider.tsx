'use client'
import { Children } from "@/lib/type";
import { useEffect, useState } from "react"
import { Socket } from "socket.io-client";
import { getSocket } from "@/services/socket/createSocket";
import { useToast } from "@/hooks/useToast";

interface Props {
    children: Children;
}

export function SocketProvider({ children }: Props) {
    const [wss, setWss] = useState<Socket | undefined>(undefined)
    const { showError, showSuccess } = useToast()

    useEffect(() => {
        const getWs = async () => {
            const newWs = await getSocket()
            setWss(newWs)
        }
        getWs()
    }, [])

    wss?.on('updateActiveTransactions', (event: MessageEvent) => {
        if (event.data.status === 'Completed') {
            const message = event.data.type
            showSuccess(message)
        }
        if (event.data.status === 'Failed') {
            const message = event.data.type
            showError(message)
        }
    })

    return (<>{children}</>)
}