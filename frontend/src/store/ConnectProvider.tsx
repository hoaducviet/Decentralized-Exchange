'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { type State, WagmiProvider } from 'wagmi'
import { configWallet } from '@/config/configWallet'
import { Children } from '@/lib/type'

type Props = {
    children: Children,
    initialState: State | undefined,
}

export function ConnectProvider({ children, initialState }: Props) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <WagmiProvider config={configWallet} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}