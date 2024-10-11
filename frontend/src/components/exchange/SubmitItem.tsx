import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'

interface Props {
    name: string;
}

export default function SubmitItem({ name }: Props) {
    return (
        <Card className="flex flex-col justify-center items-center border-none outline-none w-full h-full my-[2vh] ">
            <Button variant="secondary" className="flex flex-col border-none outline-none justify-center items-center w-full h-full text-base">{name}</Button>
        </Card>
    )
}