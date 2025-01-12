'use client'
import { useEffect, useState } from "react";
import { useGetTokensQuery } from "@/redux/features/api/apiSlice";
import { Address, Children, Collection, NFT } from "@/lib/type"
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription } from "@/components/ui/alert-dialog";
import Image from "next/image";
import API from '@/config/configApi'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
    children: Children;
    handleSend: () => Promise<void>;
    type: string | "";
    collection: Collection | undefined;
    address: Address | undefined;
    addressReceiver?: Address | undefined;
    nft: NFT | undefined;
    gasEth: string;
    newPrice?: string;
}

const addressMarket = API.addressMarketNFT as Address
export default function NFTTransactionWaiting({ children, handleSend, type, collection, nft, gasEth, address, addressReceiver, newPrice }: Props) {
    const { data: tokens } = useGetTokensQuery()
    const eth = tokens?.find(item => item.symbol === 'ETH')
    const [open, setOpen] = useState(false)
    const [addressTo, setAddressTo] = useState<Address | undefined>(undefined)
    const [priceEth, setPriceEth] = useState<number>(0)
    const [pricePlatformEth, setPricePlatformEth] = useState<number>(0)
    const [priceTotalEth, setPriceTotalEth] = useState<number>(0)
    const price = priceEth * parseFloat(eth?.price || "")
    const pricePlatform = pricePlatformEth * parseFloat(eth?.price || "")
    const priceGas = parseFloat(eth?.price || "") * parseFloat(gasEth)
    const priceTotal = priceTotalEth * parseFloat(eth?.price || "")

    useEffect(() => {
        const priceEth = newPrice ? parseFloat(newPrice || "") : parseFloat(nft?.formatted || "")
        const pricePlatformEth = priceEth * 0.3 / 100
        setPriceEth(priceEth)
        setPricePlatformEth(pricePlatformEth)

        if (type === 'Withdraw NFT') {
            setPriceTotalEth(pricePlatformEth + parseFloat(gasEth))
            setAddressTo(addressMarket)
        }
        if (type === 'Sell NFT') {
            setPriceTotalEth(pricePlatformEth + parseFloat(gasEth))
            setAddressTo(addressMarket)
        }
        if (type === 'Buy NFT') {
            setPriceTotalEth(priceEth + pricePlatformEth + parseFloat(gasEth))
            setAddressTo(nft?.owner)
        }
        if (type === 'Transfer NFT') {
            setPriceTotalEth(pricePlatformEth + parseFloat(gasEth))
            setAddressTo(addressReceiver)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newPrice, type])

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="select-none w-[20vw] max-h-[50vw] px-[1.5vw] rounded-2xl">
                <AlertDialogHeader className="bg-fixed w-full">
                    <AlertDialogTitle>{type}</AlertDialogTitle>
                    <VisuallyHidden>
                        <AlertDialogDescription>Information NFT Transaction</AlertDialogDescription>
                    </VisuallyHidden>
                </AlertDialogHeader>
                <div className="flex flex-col w-full h-full overflow-x-auto space-y-[1vw] mb-[1vw]">
                    <div className="flex flex-col justify-center items-center space-y-2">
                        <Image src={nft?.img || '/image/default-nft.png'} priority={true} alt="NFT" width={20} height={20} className="w-[5vw] h-[5vw] rounded-2xl object-cover" />
                        <div className="text-md font-semibold">{nft?.name}</div>
                    </div>
                    <div className="flex flex-col space-y-4 text-sm divide-y-reverse-[5px]">
                        <div className="flex flex-row justify-between items-center">
                            <p>From</p>
                            <p>{`${address?.slice(0, 6)}...${address?.slice(38)}`}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <p>To</p>
                            <p>{`${addressTo?.slice(0, 6)}...${addressTo?.slice(38)}`}</p>
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <p>Collection</p>
                            <div className="flex flex-col items-end">
                                <p className="font-semibold">{collection?.name}</p>
                                <p>{`${collection?.address.slice(0, 6)}...${collection?.address.slice(38)}`}</p>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            {
                                type !== "Sell NFT" ?
                                    <p>Price</p>
                                    :
                                    <p>New price</p>
                            }
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{Number.isInteger(priceEth) ? priceEth : priceEth.toFixed(6)}</p>
                                    <p className="font-semibold">{eth?.symbol}</p>
                                </div>
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`$${price.toFixed(2)}`}</p>
                                    <p className="font-semibold">USD</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <p>Platform fee (0.3%)</p>
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`${pricePlatformEth.toFixed(6)}`}</p>
                                    <p className="font-semibold">{eth?.symbol}</p>
                                </div>
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`$${pricePlatform.toFixed(2)}`}</p>
                                    <p className="font-semibold">USD</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <p>Gas fee max</p>
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`${parseFloat(gasEth).toFixed(6)}`}</p>
                                    <p className="font-semibold">{eth?.symbol}</p>
                                </div>
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`$${priceGas.toFixed(2)}`}</p>
                                    <p className="font-semibold">USD</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-start">
                            <p>Total</p>
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`- ${priceTotalEth.toFixed(6)}`}</p>
                                    <p className="font-semibold">{eth?.symbol}</p>
                                </div>
                                <div className="flex flex-row space-x-1 justify-end">
                                    <p>{`- $${priceTotal.toFixed(2)}`}</p>
                                    <p className="font-semibold">USD</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel >Close</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSend} >Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}