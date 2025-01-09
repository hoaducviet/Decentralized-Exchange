import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Address, Collection, NFT } from '@/lib/type';
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import NFTTransactionWaiting from "@/components/transaction/NFTTransactionWaiting";
import { useGasBuyNFT } from "@/hooks/useGas";
interface Props {
    nft: NFT;
    setNft: Dispatch<SetStateAction<NFT | undefined>>;
    handleSend: () => Promise<void>;
    address: Address | undefined;
    isConnected: boolean;
    collectionName: string;
    balance: string;
    collection: Collection | undefined;
}

export default function NFTItem({ nft, setNft, address, isConnected, handleSend, collectionName, collection, balance }: Props) {
    const { showError } = useToast()
    const [isCheck, setIsCheck] = useState<boolean>(false)
    const gas = useGasBuyNFT().toString()

    useEffect(() => {
        if (parseFloat(balance) > 0) {
            setIsCheck(parseFloat(balance) > parseFloat(nft.formatted))
        }
    }, [balance, nft])

    const handleClick = () => {
        if (!!nft) {
            setNft(nft)
        }
    }

    const handleToastBalance = () => {
        showError("Your balance ETH is not enoungh!")
    }

    const handleToastConnectWallet = () => {
        showError("Please Connect Wallet for Buy NFT!")
    }

    return (
        <Card className='border-none outline-none select-none w-full px-0 mx-0'>
            <CardContent className='cursor-pointer w-full px-0'>
                <Link href={`/nfts/${collectionName}/${nft.nft_id}`}>
                    <Image src={nft.img || '/image/default-nft.png'} priority={true} alt={nft.name || "nft"} width={200} height={200} className="object-cover w-full h-full" />
                </Link>
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-start space-y-[0.5vw] h-[4vw]">
                <CardTitle className='opacity-70'>{nft.name ? nft.name : `#${nft.nft_id}`}</CardTitle>
                <div className='flex flex-row justify-between items-center w-full'>
                    <div className="flex flex-row justify-start items-center space-x-1">
                        <p className='text-md'>{nft.formatted}</p>
                        <p className='text-md font-semibold'>ETH</p>
                    </div>
                    {nft.isListed && nft.owner !== address &&
                        <>
                            {isConnected ?
                                <>{isCheck ?
                                    <NFTTransactionWaiting type="Buy NFT" handleSend={handleSend} nft={nft} gasEth={gas} address={address} collection={collection}>
                                        <Button onClick={handleClick} variant="secondary">Buy</Button>
                                    </NFTTransactionWaiting>
                                    :
                                    <Button onClick={handleToastBalance} variant="secondary">Buy</Button>
                                }
                                </>
                                : <Button onClick={handleToastConnectWallet} variant="secondary">Buy</Button>
                            }
                        </>
                    }
                </div>
            </CardFooter >
        </Card >
    )
}