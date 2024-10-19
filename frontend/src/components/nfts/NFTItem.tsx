
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import Image from 'next/image';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
type NFT = {
    id: string;
    name: string;
    img: string;
    price: string;
    seller: string;
}
interface Props {
    nft: NFT;
}

export default function NFTItem({ nft }: Props) {

    return (
        <Card className='cursor-pointer border-none outline-none select-none w-full px-0 mx-0'>
            <CardContent className='w-full px-0'>
                <Image src={nft.img} alt={nft.name} width={200} height={200} className="object-cover w-full h-full" />
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-start space-y-[0.5vw]">
                <CardTitle className='opacity-70'>#{nft.id}</CardTitle>
                <div className='flex flex-row justify-between items-center w-full'>
                    <p className='text-md'>{nft.price}</p>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="secondary">Buy</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently withdraw your liquidity and send your tokens from liquidity pool.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardFooter>
        </Card>
    )
}