import { Card } from '@/components/ui/card'

interface Props {
    name: string;
    isChecked?: boolean;
}

export default function SubmitItem({ name, isChecked }: Props) {
    return (
        <Card className="cursor-pointer select-none flex flex-col justify-center items-center border-none outline-none w-full h-[3vw] my-[2vh] rounded-2xl">
            <div className={`flex flex-col rounded-2xl justify-center items-center w-full h-full text-xl ${isChecked ? "bg-blue-400 text-white" : "bg-secondary/80"}`}>{name}</div>
        </Card>
    )
} 