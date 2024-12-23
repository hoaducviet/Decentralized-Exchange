'use client'
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowsUpDownIcon } from '@heroicons/react/20/solid'
import { Trait } from "@/lib/type"

interface Props {
    traits: Trait[],
}

export default function Attributes({ traits }: Props) {

    return (
        <Card className="rounded-2xl my-0">
            <CardHeader className="my-0 py-4 rounded-t-2xl text-md font-semibold border-b-[1px]">
                <CardTitle className="flex flex-row space-x-2">
                    <ArrowsUpDownIcon className="w-4 h-4" />
                    <div>Traits Attributes</div>
                </CardTitle>
            </CardHeader>
            {traits.length ? <div className="flex flex-wrap w-full gap-y-[0.5vw] gap-x-[2%] px-[0.5vw] py-[0.8vw]">
                {traits.map((item, index) => {
                    return (<div key={index} className="dark:bg-white/10 bg-secondary/80 flex flex-col justify-center items-center w-[49%] h-[4vw] shadow-sm rounded-2xl  py-2 space-y-1">
                        <p className="font-semibold">{item.trait_type}</p>
                        <p>{item.value}</p>
                    </div>)
                })}
            </div>
                : <div className="flex flex-row justify-center items-center p-4">No Attributes</div>
            }
        </Card>
    )
}