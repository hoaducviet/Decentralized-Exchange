'use client'
import OptionsWallet from "@/components/wallet/OptionsWallet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Children } from "@/lib/type"

interface Props {
    children: Children;
}

export default function PopoverConnectWallet({ children }: Props) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="rounded-2xl">
                <OptionsWallet />
            </PopoverContent>
        </Popover>
    )
}
 