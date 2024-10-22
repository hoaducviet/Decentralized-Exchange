'use client'
import { createContext, useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { loadLiquidContract } from "@/utils/loadLiquidContract";
import { Contracts, Children, Address } from "@/lib/type";

const addressContract: Address = "0x24B3c7704709ed1491473F30393FFc93cFB0FC34" as Address

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
        if (!!provider) {
            const app = async () => {
                const contract = await loadLiquidContract({ provider, address: addressContract })
                setContracts({ look: contract })
                setIsLoaded(true)

            }
            app()

        }
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
