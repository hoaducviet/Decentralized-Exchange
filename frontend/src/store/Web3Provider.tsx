'use client'
import { createContext, useEffect, useState } from "react";
import Web3 from "web3";
import Look from '@/artifacts/Lock.json';
import { AbiItem } from "web3";
import { Contracts, Children } from "@/lib/type";

interface Props {
    children: Children;
}
interface Web3ContextType {
    web3: Web3 | undefined;
    contracts: Contracts | undefined;
    isLoaded: boolean;
}

const contractLookAddress = process.env.CONTRACT_ADDRESS_LOCK
export const Web3Context = createContext<Web3ContextType | undefined>(undefined)
export function Web3Provider({ children }: Props) {
    const [web3, setWeb3] = useState<Web3 | undefined>(undefined)
    const [contracts, setContracts] = useState<Contracts | undefined>(undefined)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    useEffect(() => {
        const initWeb3 = async () => {
            const provider = Web3.givenProvider
            if (!provider) {
                const web3Instance = new Web3(provider)
                const contractLook = new web3Instance.eth.Contract(Look.abi as AbiItem[], contractLookAddress)

                setContracts({
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
        contracts,
        isLoaded
    }
    return (
        <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
    )
}
