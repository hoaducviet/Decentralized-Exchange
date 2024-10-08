'use client'

import { useAccount } from "wagmi"
import Account from "@/components/wallet/AccountWallet"

import OptionsWallet from "@/components/wallet/OptionsWallet"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


export default function ConnectWallet() {
    const { isConnected } = useAccount()

    return (
        <div className="flex items-center">
            {isConnected ? <Account /> : (
                <div className="flex flex-row">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="secondary">
                                Connect Wallet
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <OptionsWallet />
                        </PopoverContent>
                    </Popover>
                </div>
            )}
        </div>
    )
}
