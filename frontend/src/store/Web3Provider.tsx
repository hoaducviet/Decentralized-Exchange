'use client'
import { createContext, useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { BrowserProvider, JsonRpcProvider, JsonRpcSigner } from 'ethers'
import { Children } from "@/lib/type";
import API from "@/config/configApi";

interface Props {
    children: Children;
}
interface Web3ContextType {
    provider: BrowserProvider | undefined;
    signer: JsonRpcSigner | undefined;
    jsonProvider: JsonRpcProvider | undefined;
    isLoaded: boolean;
}
const networkUrl = API.networkUrl
export const Web3Context = createContext<Web3ContextType | undefined>(undefined)
export function Web3Provider({ children }: Props) {
    const { isConnected } = useAccount()
    const { data: walletClient } = useWalletClient()
    const [provider, setProvider] = useState<BrowserProvider | undefined>(undefined)
    const [jsonProvider, setJsonProvider] = useState<JsonRpcProvider | undefined>(undefined)
    const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    useEffect(() => {
        const connetWallet = async () => {
            if (!isConnected || !walletClient) { return }

            const provider = new BrowserProvider(walletClient)
            const signer = await provider.getSigner();
            setProvider(provider);
            setSigner(signer);
            setIsLoaded(true)
        }
        connetWallet()
    }, [isConnected, walletClient])

    useEffect(() => {
        const provider = new JsonRpcProvider(networkUrl)
        setJsonProvider(provider)
    }, [])

    const value = {
        provider,
        signer,
        jsonProvider,
        isLoaded
    }
    return (
        <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
    )
}
