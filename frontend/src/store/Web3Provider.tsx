'use client'
import Web3 from "web3";
import { createContext, useEffect, useState } from "react";
import Look from '@/artifacts/Lock.json';

interface Props {
    children: React.ReactNode;
}

interface Web3ContextType {
    web3: Web3 | null;
    contract: [];
    isLoaded: boolean;
}


const contractLookAddress = process.env.CONTRACT_ADDRESS_LOCK

export const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: Props) {
    const [web3, setWeb3] = useState<Web3 | null>(null)
    const [contract, setContract] = useState<any>([])
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    useEffect(() => {
        const initWeb3 = async () => {
            const provider = Web3.givenProvider
            if (!provider) {
                const web3Instance = new Web3(provider)
                const contractLook = new web3Instance.eth.Contract(Look.abi, contractLookAddress)

                setContract({
                    look: contractLook,
                })
                setWeb3(web3Instance)
                setIsLoaded(true)
            }
        }

        initWeb3()
    }, [])

    const value = {
        web3,
        contract,
        isLoaded
    }

    return (
        <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
    )
}
