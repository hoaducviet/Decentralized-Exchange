'use client'
import { useAccount } from "wagmi"
import Account from "@/components/wallet/AccountWallet"
import { Button } from "@/components/ui/button"
import PopoverConnectWallet from "@/components/wallet/PopoverConnectWallet"

export default function ConnectWallet() {
    const { isConnected } = useAccount()

    return (
        <div className="flex items-center">
            {isConnected ? <Account /> : (
                <div className="flex flex-row">
                    <PopoverConnectWallet>
                        <Button variant="secondary">
                            Connect Wallet
                        </Button>
                    </PopoverConnectWallet>
                </div>
            )}
        </div>
    )
}
 