'use client'
import { Children } from "@/lib/type";
import { useEffect, useState } from "react"
import { useAccount } from 'wagmi'
import { Socket } from "socket.io-client";
import { getSocket } from "@/services/socket/createSocket";
import { useLoginMutation } from '@/redux/features/api/apiSlice'
import { useToast } from "@/hooks/useToast";

interface Props {
    children: Children;
}

export function SocketProvider({ children }: Props) {
    const { isConnected, address } = useAccount()
    const [wss, setWss] = useState<Socket | undefined>(undefined)
    const { showError, showSuccess } = useToast()
    const [login, { isSuccess, isError }] = useLoginMutation()

    useEffect(() => {
        const getToken = async () => {
            if (isConnected && address) {
                await login({
                    wallet: address,
                    walletAccess: isConnected
                })
                if (isSuccess) {
                    showSuccess("Login successfully!")
                }
                if (isError) {
                    showError("Login failed!")
                }
            }
        }
        getToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, address])

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