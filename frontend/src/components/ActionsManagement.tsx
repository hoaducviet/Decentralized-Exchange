'use client'
import ActionItems from "@/components/ActionItems"
import { CubeIcon, PaperPlaneIcon } from "@radix-ui/react-icons"

export default function ActionsManagement() {

    return (
        <div className="flex flex-row w-full p-[0.6vw]">
            <ActionItems name="Deposits from bank" Icon={CubeIcon as React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>} />
            <ActionItems name="Withdraw to bank" Icon={PaperPlaneIcon as React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>} />
        </div>
    )
}