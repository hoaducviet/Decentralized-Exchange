import { Dispatch, SetStateAction } from "react";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { NFT } from '@/lib/type';
interface Props {
    nft: NFT;
    setNft: Dispatch<SetStateAction<NFT | undefined>>;
    handleSend: () => Promise<void>;
}

export default function NFTItem({ nft, setNft, handleSend }: Props) {

    const handleClick = () => {
        if (!!nft) {
            setNft(nft)
        }
    }
    return (
        <Card className='cursor-pointer border-none outline-none select-none w-full px-0 mx-0'>
            <CardContent className='w-full px-0'>
                <Image src={nft.img || '/image/default-nft.png'} alt={nft.name || "nft"} width={200} height={200} className="object-cover w-full h-full" />
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-start space-y-[0.5vw]">
                <CardTitle className='opacity-70'># {nft.id}</CardTitle>
                <div className='flex flex-row justify-between items-center w-full'>
                    <p className='text-md'>{nft.formatted}</p>
                    <p className='text-md font-semibold'>ETH</p>
                    {nft.isListed &&
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button onClick={handleClick} variant="secondary">Buy</Button>
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
                                    <AlertDialogAction onClick={handleSend}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    }
                </div>
            </CardFooter>
        </Card>
    )
}