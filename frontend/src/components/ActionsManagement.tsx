'use client'
import Link from "next/link"
import ActionItems from "@/components/ActionItems"
import { CubeIcon, PaperPlaneIcon } from "@radix-ui/react-icons"

const options = [
    {
        name: 'Deposits from bank',
        icon: CubeIcon as React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>,
        link: '/payment'
    },
    {
        name: 'Withdraw to bank',
        icon: PaperPlaneIcon as React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>,
        link: '/payout'
    }
]
export default function ActionsManagement() {

    return (
        <div className="flex flex-row w-full p-[0.6vw]">
            {options.map((option, index) => {
                return (
                    <div key={index} className="cursor-pointer flex w-full mx-2">
                        <Link href={option.link}>
                            <ActionItems name={option.name} Icon={option.icon} />
                        </Link>
                    </div>
                )
            })}
        </div>
    )
}