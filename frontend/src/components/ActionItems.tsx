import { Card } from "@/components/ui/card"
import { RefAttributes, SVGProps } from "react";

interface Props {
    name: string;
    Icon: React.ForwardRefExoticComponent<SVGProps<SVGSVGElement> & RefAttributes<SVGSVGElement>>;
}

export default function ActionItems({ name, Icon }: Props) {
    return (
        <Card className="bg-transparent select-none flex flex-col border-none outline-none w-full p-[1vw] mx-[0.2vw]">
                <div className="flex justify-start my-[0.2vw]"><Icon width={24} height={24} /></div>
                <div className="text-md font-semibold opacity-80 my-[0.2vw]">{name}</div>
        </Card>
    )
}