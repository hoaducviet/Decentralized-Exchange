'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { type State, WagmiProvider } from 'wagmi'

import { configWallet } from '@/config/configWallet'

type Props = {
    children: ReactNode,
    initialState: State | undefined,
}

export function ConnectProviders({ children, initialState }: Props) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <WagmiProvider config={configWallet} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}