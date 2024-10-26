'use client'
import { createContext, useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { loadLiquidContract } from "@/utils/loadLiquidContract";
import { Contracts, Children } from "@/lib/type";
import { useBalances } from "@/hooks/useBalances";
import { Address } from "viem";

interface Props {
    children: Children;
}
interface Web3ContextType {
    provider: BrowserProvider | undefined;
    signer: JsonRpcSigner | undefined;
    contracts: Contracts | undefined;
    isLoaded: boolean;
}

export const Web3Context = createContext<Web3ContextType | undefined>(undefined)
export function Web3Provider({ children }: Props) {
    const { isConnected } = useAccount()
    const { liquidBalances } = useBalances()
    const { data: walletClient } = useWalletClient()
    const [provider, setProvider] = useState<BrowserProvider | undefined>(undefined)
    const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined)
    const [contracts, setContracts] = useState<Contracts | undefined>(undefined)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    useEffect(() => {
        const connetWallet = async () => {
            if (!isConnected || !walletClient) { return }

            const provider = new BrowserProvider(walletClient)
            const signer = await provider.getSigner();
            setProvider(provider);
            setSigner(signer);
        }
        connetWallet()

    }, [isConnected, walletClient])

    useEffect(() => {
        if (!!provider && liquidBalances.length > 0) {
            const app = async () => {
                const addressContract: Address = liquidBalances[0]?.info.address as Address;
                const contract = await loadLiquidContract({ provider, address: addressContract })
                setContracts({ look: contract })
                setIsLoaded(true)

            }
            app()

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider])

    const value = {
        provider,
        signer,
        contracts,
        isLoaded
    }
    return (
        <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
    )
}
